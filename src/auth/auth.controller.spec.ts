import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { register } from 'module';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/user/types/userRole.type';
import { User } from 'src/user/entities/user.entity';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: TransactionInterceptor,
          useClass: TransactionInterceptor,
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('회원가입 테스트', () => {
    it('회원가입 성공 검증', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        nickname: 'nickname',
        role: Role.User,
      };

      const transactionManager = {};

      await authController.register(registerDto, transactionManager);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.nickname,
        registerDto.role,
        transactionManager,
      );
    });

    it('비밀번호 확인 오류 검증', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password444',
        nickname: 'nickname',
        role: Role.User,
      };

      await expect(authController.register(registerDto, {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('로그인 테스트', () => {
    it('로그인 성공 검증', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });
});
