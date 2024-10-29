import _ from 'lodash';
import { compare, hash } from 'bcrypt';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Point } from '../point/entities/point.entity';
import { Role } from 'src/user/types/userRole.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async register(
    email: string,
    password: string,
    nickname: string,
    role: Role,
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const existingEmail = await this.userRepository.findOne({
      where: { nickname: nickname },
    });
    if (existingEmail) {
      throw new ConflictException(
        '이미 해당 닉네임으로 가입된 사용자가 있습니다!',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const hashedPassword = await hash(password, 10);
      const newUser = await queryRunner.manager.save(User, {
        email,
        role,
        password: hashedPassword,
        nickname,
      });

      await queryRunner.manager.save(Point, {
        user: { id: newUser.id },
        reason: '회원가입 증정 포인트',
      });

      await queryRunner.commitTransaction();

      return await this.userRepository.findOne({
        where: { id: newUser.id },
        select: ['id', 'email', 'nickname', 'createdAt', 'role'],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      message: '로그인을 완료 하였습니다.',
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
