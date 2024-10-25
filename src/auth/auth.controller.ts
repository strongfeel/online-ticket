import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';

import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { AuthService } from './auth.service';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { TransactionManager } from 'src/utils/transaction.decorator';
import { EntityManager } from 'typeorm';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(TransactionInterceptor)
  async register(
    @Body() registerDto: RegisterDto,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException('비밀번호 확인을 다시 작성해 주세요.');
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
