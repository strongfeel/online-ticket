import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHallDto {
  @IsString()
  @IsOptional()
  hallName?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  totalSeat?: number;
}
