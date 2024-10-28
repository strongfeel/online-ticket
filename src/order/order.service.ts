import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Point } from 'src/point/entities/point.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderInfo } from 'src/orderInfo/entities/orderInfo.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(OrderInfo)
    private orderDataRepository: Repository<OrderInfo>,
    @InjectRepository(Point) private pointRepository: Repository<Point>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const seatData = await this.seatRepository.find({
      where: { id: In(createOrderDto.seatId) },
      relations: {
        schedule: true,
        show: true,
        hall: true,
      },
    });

    let totalPrice = 0;

    for (let i = 0; i < seatData.length; i++) {
      totalPrice += seatData[i].show.price;
    }

    const checkPoint = await this.pointRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    if (checkPoint.totalPoint < totalPrice) {
      throw new BadRequestException('포인트가 부족 합니다.');
    }

    const seatCount = seatData.length;

    if (seatData[0].show.remainingSeat < seatCount) {
      throw new BadRequestException('좌석이 부족 합니다.');
    }

    for (let i = 0; i < seatData.length; i++) {
      if (seatData[i].seatStatus === false) {
        throw new BadRequestException(
          '해당하는 좌석은 이미 예매가 완료 되었습니다.',
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const order = await queryRunner.manager.save(Order, {
        user: { id: userId },
        payment: { id: createOrderDto.paymentId },
        totalPrice: totalPrice,
      });

      for (let i = 0; i < seatData.length; i++) {
        await queryRunner.manager.save(OrderInfo, {
          order: { id: order.id },
          seat: { id: seatData[i].id },
          schedule: { id: seatData[i].schedule.id },
          show: { id: seatData[i].show.id },
          hall: { id: seatData[i].hall.id },
        });
      }

      await queryRunner.manager.save(Point, {
        user: { id: userId },
        pointDetails: `- ${totalPrice}`,
        reason: '공연 예매',
        totalPoint: checkPoint.totalPoint - totalPrice,
      });

      await queryRunner.manager.update(
        Order,
        { id: order.id },
        { orderState: true },
      );

      await queryRunner.manager.decrement(
        Show,
        { id: seatData[0].show.id },
        'remainingSeat',
        seatCount,
      );

      for (let i = 0; i < seatData.length; i++) {
        await queryRunner.manager.update(
          Seat,
          { id: seatData[i].id },
          { seatStatus: false },
        );
      }

      await queryRunner.commitTransaction();

      const returnOrder = await this.orderRepository.findOne({
        where: { id: order.id },
        relations: {
          orderInfos: true,
        },
      });

      return {
        message: '공연 예매 완료하였습니다.',
        returnOrder,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
