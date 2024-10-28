import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentRepository.save({
      paymentName: createPaymentDto.paymentName,
    });

    return { message: '결제 수단을 생성 하였습니다.', payment };
  }

  async delete(id: number) {
    const verifyPaymentId = await this.paymentRepository.findOne({
      where: { id: id },
    });

    if (!verifyPaymentId) {
      throw new BadRequestException('해당하는 결제 수단이 없습니다.');
    }

    await this.paymentRepository.delete({ id: id });
    return { message: '해당하는 결제 수단을 삭제 하였습니다.' };
  }

  async findAll() {
    return await this.paymentRepository.find();
  }
}
