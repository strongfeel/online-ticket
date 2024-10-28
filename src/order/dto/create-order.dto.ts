import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @Type(() => Number)
  @IsNotEmpty({ message: '예매하실 좌석을 입력해 주세요.' })
  seatId: number[];

  @IsNumber()
  @IsNotEmpty({ message: '결제 방법을 선택해 주세요.' })
  paymentId: number;
}
