import { Hall } from 'src/hall/entities/hall.entity';
import { OrderSeat } from 'src/orderSeat/entities/orderSeat.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Show } from 'src/show/entities/show.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'seats' })
export class Seat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  seatNumber: number;

  @Column({ type: 'boolean', default: true })
  seatStatus: boolean;

  @ManyToOne(() => Hall, (hall) => hall.seats, { onDelete: 'CASCADE' })
  hall: Hall;

  @ManyToOne(() => Show, (show) => show.seats, { onDelete: 'CASCADE' })
  show: Show;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats, {
    onDelete: 'CASCADE',
  })
  schedule: Schedule;

  @OneToMany(() => OrderSeat, (orderSeat) => orderSeat.seat)
  orderSeats: OrderSeat[];
}
