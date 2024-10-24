import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScheduleDto {
  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  @IsNotEmpty({ message: '공연 스케쥴을 입력해 주세요.' })
  scheduleDate: Date[];

  @IsNumber()
  @IsNotEmpty({ message: '공연 아이디를 입력해 주세요.' })
  showId: number;

  @IsNumber()
  @IsNotEmpty({ message: '공연장 아이디를 입력해 주세요.' })
  hallId: number;
}
