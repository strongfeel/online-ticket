import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import _ from 'lodash';

@Injectable()
export class ShowService {
  //   constructor(
  //     @InjectRepository(Show) private showRepository: Repository<Show>,
  //   ) {}
  //   async create(createShowDto: CreateShowDto) {
  //     const existingShow = await this.showRepository.findBy({
  //       showName: createShowDto.showName,
  //     });
  //     if (existingShow.length !== 0) {
  //       throw new ConflictException(
  //         '이미 해당 공연 이름으로 만들어진 공연이 있습니다!',
  //       );
  //     }
  //     const show = await this.showRepository.save(createShowDto);
  //     return show;
  //   }
  //   async update(id: number, updateShowDto: UpdateShowDto) {
  //     await this.verifyShowById(id);
  //     if (updateShowDto.showName) {
  //       const existingShow = await this.showRepository.findBy({
  //         showName: updateShowDto.showName,
  //       });
  //       if (existingShow.length !== 0) {
  //         throw new ConflictException(
  //           '이미 해당하는 이름으로 만들어진 공연이 존재합니다!',
  //         );
  //       }
  //     }
  //     const show = await this.showRepository.update({ id }, updateShowDto);
  //     return { message: '공연 수정을 성공적으로 완료 하였습니다.', show };
  //   }
  //   async delete(id: number) {
  //     await this.verifyShowById(id);
  //     await this.showRepository.delete({ id: id });
  //     return { message: '공연장 삭제가 완료 되었습니다.' };
  //   }
  //   async findAll(): Promise<Show[]> {
  //     const getShow = await this.showRepository.find({
  //       select: ['id', 'showName', 'category', 'price'],
  //     });
  //     if (getShow.length === 0) {
  //       throw new BadRequestException('등록된 공연장이 없습니다.');
  //     }
  //     return getShow;
  //   }
  //   private async verifyShowById(id: number) {
  //     const show = await this.showRepository.findOneBy({ id });
  //     if (_.isNil(show)) {
  //       throw new BadRequestException('존재하지 않는 공연장입니다.');
  //     }
  //     return show;
  //   }
}
