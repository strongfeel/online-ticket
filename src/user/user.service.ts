import _ from 'lodash';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Point } from '../point/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Point) private pointRepository: Repository<Point>,
  ) {}

  async getUser(user: User) {
    const getTotalPoint = await this.pointRepository.findOne({
      where: { userId: user.id },
      select: { totalPoint: true },
      order: { createdAt: 'DESC' },
    });
    const getNickName = await this.userRepository.findOne({
      where: { id: user.id },
      select: { nickname: true },
    });
    return { getNickName, getTotalPoint };
  }
}
