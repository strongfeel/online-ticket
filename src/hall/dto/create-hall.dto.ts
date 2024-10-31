import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHallDto {
  @IsString()
  @IsNotEmpty({ message: '공연장 이름을 입력해 주세요.' })
  hallName: string;

  @IsString()
  @IsNotEmpty({ message: '공연장 장소를 입력해 주세요.' })
  location: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연장 좌석 수를 입력해 주세요.' })
  totalSeat: number;
}
