import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Repository } from 'typeorm';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import _ from 'lodash';

@Injectable()
export class HallService {
  constructor(
    @InjectRepository(Hall) private hallRepository: Repository<Hall>,
  ) {}

  async create(createHallDto: CreateHallDto) {
    const existingHall = await this.hallRepository.findBy({
      hallName: createHallDto.hallName,
    });

    if (existingHall) {
      throw new ConflictException(
        '이미 해당 공연장 이름으로 만들어진 공연장이 있습니다!',
      );
    }

    const hall = await this.hallRepository.save(createHallDto);

    return hall;
  }

  async update(id: number, updateHallDto: UpdateHallDto) {
    await this.verifyHallById(id);

    return await this.hallRepository.update({ id }, updateHallDto);
  }

  async delete(id: number) {
    await this.verifyHallById(id);

    await this.hallRepository.delete({ id: id });

    return { message: '공연장 삭제가 완료 되었습니다.' };
  }

  async findAll(): Promise<Hall[]> {
    return await this.hallRepository.find({
      select: ['id', 'hallName', 'location', 'totalSeat'],
    });
  }

  private async verifyHallById(id: number) {
    const hall = await this.hallRepository.findOneBy({ id });
    if (_.isNil(hall)) {
      throw new NotFoundException('존재하지 않는 팀입니다.');
    }

    return hall;
  }
}
