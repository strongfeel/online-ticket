import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateShowDto {
  @IsNumber()
  @IsNotEmpty({ message: '공연장 아이디를 입력해 주세요.' })
  hallId: number;

  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해 주세요.' })
  showName: string;

  @IsString()
  @IsNotEmpty({ message: '이미지를 입력해 주세요.' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해 주세요.' })
  showExplain: string;

  @IsString()
  @IsNotEmpty({ message: '공연 카테고리를 입력해 주세요.' })
  category: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연 가격을 입력해 주세요.' })
  price: number;
}
