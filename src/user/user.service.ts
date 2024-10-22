import _ from 'lodash';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Point } from '../point/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Point) private pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, nickname: string) {
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
      password: hashedPassword,
      nickname,
    });

    const newPoint = await this.pointRepository.save({
      userId: newUser.id,
      reason: '회원가입 포인트',
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
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUser(user: User) {
    const getUserPoint = await this.pointRepository.findOne({
      where: { userId: user.id },
      select: { point: true },
    });
    const getNickName = await this.userRepository.findOne({
      where: { id: user.id },
      select: { nickname: true },
    });
    return { getNickName, getUserPoint };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
