import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Hall } from 'src/hall/entities/hall.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Repository } from 'typeorm';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Show } from './entities/show.entity';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(Hall) private hallRepository: Repository<Hall>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}
  async create(createShowDto: CreateShowDto) {
    const checkHall = await this.hallRepository.findOne({
      where: { id: createShowDto.hallId },
    });

    if (!checkHall) {
      throw new BadRequestException('해당하는 공연장이 존재하지 않습니다.');
    }

    const existingShow = await this.showRepository.findOne({
      where: { showName: createShowDto.showName },
    });

    if (existingShow) {
      throw new BadRequestException(
        '이미 해당 공연 이름으로 만들어진 공연이 있습니다!',
      );
    }

    const show = await this.showRepository.save({
      hall: checkHall,
      showName: createShowDto.showName,
      image: createShowDto.image,
      showExplain: createShowDto.showExplain,
      category: createShowDto.category,
      price: createShowDto.price,
      remainingSeat: checkHall.totalSeat,
    });
    return show;
  }

  async update(id: number, updateShowDto: UpdateShowDto) {
    await this.verifyShowById(id);
    if (updateShowDto.showName) {
      const existingShow = await this.showRepository.findOne({
        where: { showName: updateShowDto.showName },
      });
      if (existingShow) {
        throw new BadRequestException(
          '이미 해당하는 이름으로 만들어진 공연이 존재합니다!',
        );
      }
    }
    await this.showRepository.update({ id }, updateShowDto);
    return { message: '공연 수정을 성공적으로 완료 하였습니다.' };
  }

  async delete(id: number) {
    await this.verifyShowById(id);
    await this.showRepository.delete({ id: id });
    return { message: '공연 삭제가 완료 되었습니다.' };
  }

  async findAll(): Promise<Show[]> {
    const getShow = await this.showRepository.find({
      select: ['id', 'showName', 'category', 'price'],
    });
    if (getShow.length === 0) {
      throw new BadRequestException('등록된 공연장이 없습니다.');
    }
    return getShow;
  }

  async findCategory(category: string): Promise<Show[]> {
    const getShow = await this.showRepository.findBy({
      category: category,
    });
    if (getShow.length === 0) {
      throw new BadRequestException('등록된 카테고리가 없습니다.');
    }
    return getShow;
  }

  //TODO: 공연 일정 확인 및 남은 좌석 확인 후 메세지로 리턴
  async findOne(id: number) {
    await this.verifyShowById(id);

    const getShow = await this.showRepository.findOne({
      where: { id: id },
      relations: {
        hall: true,
      },
    });

    const getScheduleDate = await this.scheduleRepository.find({
      where: {
        show: { id: getShow.id },
        hall: { id: getShow.hall.id },
      },
    });

    const today = new Date();

    if (
      getShow.remainingSeat > 0 &&
      getScheduleDate.length > 0 &&
      getScheduleDate.some((schedule) => schedule.scheduleDate > today)
    ) {
      return { getShow, message: '해당하는 공연은 예매가 가능 합니다.' };
    }

    return { getShow, message: '해당하는 공연은 예매가 불가능 합니다.' };
  }

  async searchShowName(showName: string) {
    const getShow = await this.showRepository.findOne({
      where: { showName: showName },
      relations: {
        hall: true,
        schedules: true,
      },
    });
    if (!getShow) {
      throw new BadRequestException('해당하는 이름의 공연이 없습니다.');
    }
    return getShow;
  }

  private async verifyShowById(id: number) {
    const show = await this.showRepository.findOneBy({ id });
    if (_.isNil(show)) {
      throw new BadRequestException('존재하지 않는 공연입니다.');
    }
    return show;
  }
}
