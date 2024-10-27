import { Hall } from 'src/hall/entities/hall.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Show } from 'src/show/entities/show.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'timestamp', nullable: false })
  scheduleDate: Date;

  @ManyToOne(() => Show, (show) => show.schedules, { onDelete: 'CASCADE' })
  show: Show;

  @ManyToOne(() => Hall, (hall) => hall.schedules, { onDelete: 'CASCADE' })
  hall: Hall;

  @OneToMany(() => Seat, (seat) => seat.show)
  seats: Seat[];
}
