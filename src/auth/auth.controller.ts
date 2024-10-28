import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';

import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthService } from './auth.service';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { QueryRunnerParam, Transaction } from 'src/utils/transaction.decorator';
import { QueryRunner } from 'typeorm';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(TransactionInterceptor)
  @Transaction('READ COMMITTED')
  async register(
    @Body() registerDto: RegisterDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException('비밀번호 확인을 다시 작성해 주세요.');
    }

    return await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.nickname,
      registerDto.role,
      queryRunner,
    );
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
