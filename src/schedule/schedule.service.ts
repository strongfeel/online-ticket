import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Show } from 'src/show/entities/show.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import _ from 'lodash';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(Hall) private hallRepository: Repository<Hall>,
  ) {}

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    await this.verifyScheduleById(id);
    await this.scheduleRepository.update({ id: id }, updateScheduleDto);
    return { message: '공연 스케쥴 수정을 성공적으로 완료 하였습니다.' };
  }

  async delete(id: number) {
    await this.verifyScheduleById(id);
    await this.scheduleRepository.delete({ id: id });
    return { message: '공연 스케쥴 삭제가 완료 되었습니다.' };
  }

  async findSchedule(hallId: number, showId: number) {
    const hall = await this.hallRepository.findOne({
      where: { id: hallId },
    });

    const show = await this.showRepository.findOne({
      where: { id: showId },
      relations: {
        hall: true,
      },
    });

    if (!show || !hall) {
      throw new NotFoundException('공연 또는 공연장을 찾을 수 없습니다.');
    }

    if (show.hall.id !== hall.id) {
      throw new BadRequestException(
        '해당하는 공연장에 해당하는 공연이 없습니다.',
      );
    }

    const schedule = await this.scheduleRepository.findOne({
      where: {
        show: { id: show.id },
        hall: { id: hall.id },
      },
    });

    return schedule;
  }

  private async verifyScheduleById(id: number) {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (_.isNil(schedule)) {
      throw new BadRequestException('존재하지 않는 스케쥴 입니다.');
    }
    return schedule;
  }
}
