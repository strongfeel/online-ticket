import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { Role } from 'src/user/types/userRole.type';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import exp from 'constants';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let transactionManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    transactionManager = {
      save: jest.fn(),
    } as unknown as EntityManager;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('회원가입 테스트', () => {
    it('회원가입 성공 검증', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const nickname = 'testuser';
      const role = Role.User;
      const hashedPassword = 'hashedpassword';
      const newUser = { id: 1, email, nickname, role, createdAt: new Date() };

      jest.spyOn(authService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (transactionManager.save as jest.Mock).mockResolvedValueOnce(newUser);

      const result = await authService.register(
        email,
        password,
        nickname,
        role,
        transactionManager,
      );

      expect(result).toEqual({
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        createdAt: newUser.createdAt,
        role: newUser.role,
      });
      expect(authService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(transactionManager.save).toHaveBeenCalledTimes(2);
    });

    it('동일한 이메일이 존재하는지 검증', async () => {
      const email = 'test@test.com';
      jest.spyOn(authService, 'findByEmail').mockResolvedValue({} as User);

      await expect(
        authService.register(
          email,
          'password',
          'nickname',
          Role.User,
          transactionManager,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('동일한 닉네임이 존재하는지 검증', async () => {
      const email = 'test@test.com';
      const nickname = 'test';

      jest.spyOn(authService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);

      await expect(
        authService.register(
          email,
          'password',
          nickname,
          Role.User,
          transactionManager,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('로그인 테스트', () => {
    it('로그인 성공 검증', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const user = { id: 1, email, password: 'hashedPassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('access_token');

      const result = await authService.login(email, password);

      expect(result).toEqual({
        message: '로그인을 완료 하였습니다.',
        access_token: 'access_token',
      });

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: ['id', 'email', 'password'],
      });
    });

    it('이메일 존재하는지 검증', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        authService.login('test@test.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('비밀번호 확인 검증', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const user = { id: 1, email, password: 'hashedPassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findByEmail', () => {
    it('이메일로 유저 확인 검증', async () => {
      const email = 'test@test.com';
      const user = { id: 1, email };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);

      const result = await authService.findByEmail(email);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });
});
