import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/show/entities/show.entity';
import { Schedule } from './entities/schedule.entity';
import { Hall } from 'src/hall/entities/hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Hall, Schedule])],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
