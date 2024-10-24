import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { Show } from './entities/show.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from 'src/hall/entities/hall.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Hall, Schedule])],
  providers: [ShowService],
  controllers: [ShowController],
})
export class ShowModule {}
