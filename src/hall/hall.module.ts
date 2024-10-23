import { Module } from '@nestjs/common';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall])],
  providers: [HallService],
  controllers: [HallController],
})
export class HallModule {}
