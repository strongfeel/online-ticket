import _ from 'lodash';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';

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
    @InjectRepository(Point) private pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
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

    const hashedPassword = await hash(password, 10);
    const newUser = await this.userRepository.save({
      email,
      role,
      password: hashedPassword,
      nickname,
    });

    await this.pointRepository.save({
      user: newUser,
      reason: '회원가입 증정 포인트',
    });

    return await this.userRepository.findOne({
      where: { id: newUser.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        role: true,
      },
    });
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
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
