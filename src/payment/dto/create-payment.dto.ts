import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: '결제 수단 이름을 입력해 주세요.' })
  paymentName: string;
}
