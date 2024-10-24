import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateScheduleDto {
  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  @IsNotEmpty({ message: '변경 날짜를 작성해 주세요.' })
  scheduleDate: Date[];
}
