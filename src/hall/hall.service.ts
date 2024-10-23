import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Hall } from './entities/hall.entity';

@Injectable()
export class HallService {
  constructor(
    @InjectRepository(Hall) private hallRepository: Repository<Hall>,
  ) {}

  async create(createHallDto: CreateHallDto) {
    const existingHall = await this.hallRepository.findBy({
      hallName: createHallDto.hallName,
    });

    if (existingHall.length !== 0) {
      throw new ConflictException(
        '이미 해당 공연장 이름으로 만들어진 공연장이 있습니다!',
      );
    }

    const hall = await this.hallRepository.save(createHallDto);

    return hall;
  }

  async update(id: number, updateHallDto: UpdateHallDto) {
    await this.verifyHallById(id);

    if (updateHallDto.hallName) {
      const existingHall = await this.hallRepository.findBy({
        hallName: updateHallDto.hallName,
      });

      if (existingHall.length !== 0) {
        throw new ConflictException(
          '이미 해당하는 이름으로 만들어진 공연장이 있습니다!',
        );
      }
    }

    const hall = await this.hallRepository.update({ id }, updateHallDto);

    return { message: '공연장 수정을 성공적으로 완료 하였습니다.', hall };
  }

  async delete(id: number) {
    await this.verifyHallById(id);

    await this.hallRepository.delete({ id: id });

    return { message: '공연장 삭제가 완료 되었습니다.' };
  }

  async findAll(): Promise<Hall[]> {
    const getHall = await this.hallRepository.find({
      select: ['id', 'hallName', 'location', 'totalSeat'],
    });

    if (getHall.length === 0) {
      throw new BadRequestException('등록된 공연장이 없습니다.');
    }

    return getHall;
  }

  private async verifyHallById(id: number) {
    const hall = await this.hallRepository.findOneBy({ id });
    if (_.isNil(hall)) {
      throw new BadRequestException('존재하지 않는 공연장입니다.');
    }

    return hall;
  }
}
