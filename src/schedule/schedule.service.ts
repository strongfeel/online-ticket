import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Hall } from 'src/hall/entities/hall.entity';
import { Show } from 'src/show/entities/show.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(Hall) private hallRepository: Repository<Hall>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const hall = await this.hallRepository.findOne({
      where: { id: createScheduleDto.hallId },
    });

    const show = await this.showRepository.findOne({
      where: { id: createScheduleDto.showId },
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

    const schedules = createScheduleDto.scheduleDate.map((date) => {
      const schedule = new Schedule();
      schedule.scheduleDate = date;
      schedule.show = show;
      schedule.hall = hall;
      return schedule;
    });

    await this.scheduleRepository.save(schedules);

    return { message: '스케쥴을 생성 하였습니다.' };
  }

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
