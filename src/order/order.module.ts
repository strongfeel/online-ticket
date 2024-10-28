import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from 'src/point/entities/point.entity';
import { OrderInfo } from 'src/orderInfo/entities/orderInfo.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Point, OrderInfo, Seat])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
