import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/user/types/userRole.type';

export class RegisterDto {
  @IsEmail({}, { message: '이메일 형식으로 작성해 주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/, {
    message:
      '패스워드는 8~16자리이며 최소 하나 이상의 영문자, 최소 하나 이상의 숫자, 최소 하나 이상의 특수문자를 입력해야 합니다.',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '확인 비밀번호를 입력해주세요.' })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;

  @IsEnum(Role)
  role: Role;
}
