import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { TransactionManager } from 'src/utils/transaction.decorator';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(ClassSerializerInterceptor, TransactionInterceptor)
  async register(
    @Body() registerDto: RegisterDto,
    @TransactionManager() transactionManager,
  ) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('비밀번호 확인을 다시 작성해 주세요.');
    }

    return await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.nickname,
      registerDto.role,
      transactionManager,
    );
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
