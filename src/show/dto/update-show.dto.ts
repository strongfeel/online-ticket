import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateShowDto {
  @IsString()
  @IsOptional()
  showName?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  showExplain?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  hallId?: number;
}
