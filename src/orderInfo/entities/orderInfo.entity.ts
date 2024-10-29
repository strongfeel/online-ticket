import { Hall } from 'src/hall/entities/hall.entity';
import { Order } from 'src/order/entities/order.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orderinfos' })
export class OrderInfo {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.orderInfos, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Seat, (seat) => seat.orderInfos, {
    onDelete: 'CASCADE',
  })
  seat: Seat;

  @ManyToOne(() => Schedule, (schedule) => schedule.orderInfos)
  schedule: Schedule;

  @ManyToOne(() => Show, (show) => show.orderInfos)
  show: Show;

  @ManyToOne(() => Hall, (hall) => hall.orderInfos)
  hall: Hall;
}
