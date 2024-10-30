import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderInfo } from 'src/orderInfo/entities/orderInfo.entity';
import { Point } from 'src/point/entities/point.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Point) private pointRepository: Repository<Point>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
    transactionManager: EntityManager,
  ) {
    const seatData = await this.seatRepository.find({
      where: { id: In(createOrderDto.seatId) },
      relations: {
        schedule: true,
        show: true,
        hall: true,
      },
      lock: { mode: 'pessimistic_read' },
    });

    let totalPrice = 0;

    for (let seat of seatData) {
      totalPrice += seat.show.price;
    }

    const checkPoint = await this.pointRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      lock: { mode: 'pessimistic_read' },
    });

    if (checkPoint.totalPoint < totalPrice) {
      throw new BadRequestException('포인트가 부족 합니다.');
    }

    const seatCount = seatData.length;

    if (seatData[0].show.remainingSeat < seatCount) {
      throw new BadRequestException('좌석이 부족 합니다.');
    }

    for (let seat of seatData) {
      if (seat.seatStatus === false) {
        throw new BadRequestException(
          '해당하는 좌석은 이미 예매가 완료 되었습니다.',
        );
      }
    }
    const order = await transactionManager.save(Order, {
      user: { id: userId },
      payment: { id: createOrderDto.paymentId },
      totalPrice: totalPrice,
    });

    for (let seat of seatData) {
      await transactionManager.insert(OrderInfo, {
        order: { id: order.id },
        seat: { id: seat.id },
        schedule: { id: seat.schedule.id },
        show: { id: seat.show.id },
        hall: { id: seat.hall.id },
      });
    }

    await transactionManager.save(Point, {
      user: { id: userId },
      pointDetails: `- ${totalPrice}`,
      reason: '공연 예매',
      totalPoint: checkPoint.totalPoint - totalPrice,
    });

    await transactionManager.update(
      Order,
      { id: order.id },
      { orderState: true },
    );

    await transactionManager.decrement(
      Show,
      { id: seatData[0].show.id },
      'remainingSeat',
      seatCount,
    );

    for (let seat of seatData) {
      await transactionManager.update(
        Seat,
        { id: seat.id },
        { seatStatus: false },
      );
    }

    const returnOrder = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: {
        orderInfos: {
          hall: true,
          show: true,
          schedule: true,
          seat: true,
        },
      },
    });

    return {
      message: '공연 예매 완료하였습니다.',
      returnOrder,
    };
  }

  async findAll(userId: number) {
    const findOrder = await this.orderRepository.find({
      where: { user: { id: userId }, deletedAt: null },
      relations: {
        orderInfos: {
          hall: true,
          show: true,
          schedule: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    if (findOrder.length === 0) {
      throw new BadRequestException('예매 내역이 존재하지 않습니다.');
    }

    return findOrder;
  }

  async delete(userId: number, id: number, transactionManager: EntityManager) {
    const getOrder = await this.orderRepository.findOne({
      where: { id: id, user: { id: userId } },
      relations: {
        orderInfos: {
          schedule: true,
          seat: true,
        },
      },
    });

    if (!getOrder) {
      throw new BadRequestException('예매 내역이 없습니다.');
    }

    const date = new Date();
    const scheduleDate = new Date(getOrder.orderInfos[0].schedule.scheduleDate);
    const threeHoursBefore = new Date(
      scheduleDate.getTime() - 3 * 60 * 60 * 1000,
    );

    if (date >= threeHoursBefore) {
      throw new BadRequestException(
        '예매 취소는 공연 시작 3시간 전까지만 가능합니다.',
      );
    }

    if (getOrder.deletedAt !== null) {
      throw new BadRequestException('이미 해당하는 예매는 취소 되었습니다.');
    }

    const point = await this.pointRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    await transactionManager.softDelete(Order, { id: id });

    for (let i = 0; i < getOrder.orderInfos.length; i++) {
      await transactionManager.update(
        Seat,
        { id: getOrder.orderInfos[i].seat.id },
        { seatStatus: true },
      );
    }

    await transactionManager.save(Point, {
      user: { id: userId },
      pointDetails: `+ ${getOrder.totalPrice}`,
      reason: '예매 취소',
      totalPoint: point.totalPoint + getOrder.totalPrice,
    });

    return { message: '해당하는 예매를 성공적으로 취소했습니다.' };
  }

  async findSeats(id: number) {
    const seat = await this.seatRepository.find({
      where: { schedule: { id: id }, seatStatus: true },
      select: { id: true, seatNumber: true },
    });

    if (seat.length === 0) {
      throw new BadRequestException(
        '해당하는 좌석과 스케쥴이 존재하지 않습니다.',
      );
    }

    return seat;
  }
}
