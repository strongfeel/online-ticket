import { Hall } from 'src/hall/entities/hall.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Show } from 'src/show/entities/show.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'seats' })
export class Seat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  seatNumber: number;

  @Column({ type: 'boolean', default: true })
  seatStatus: boolean;

  @ManyToOne(() => Hall, (hall) => hall.seats)
  hall: Hall;

  @ManyToOne(() => Show, (show) => show.seats)
  show: Show;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats)
  schedule: Schedule;
}
