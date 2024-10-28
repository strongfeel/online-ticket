import { Order } from 'src/order/entities/order.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'halls' })
export class Hall {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  hallName: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'int', nullable: false })
  totalSeat: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany((type) => Show, (show) => show.hall)
  shows: Show[];

  @OneToMany((type) => Schedule, (schedule) => schedule.hall)
  schedules: Schedule[];

  @OneToMany((type) => Seat, (seat) => seat.hall)
  seats: Seat[];

  @OneToMany((type) => Order, (order) => order.hall)
  orders: Order[];
}
