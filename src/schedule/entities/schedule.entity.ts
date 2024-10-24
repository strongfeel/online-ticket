import { Hall } from 'src/hall/entities/hall.entity';
import { Show } from 'src/show/entities/show.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'timestamp', nullable: false })
  scheduleDate: Date;

  @ManyToOne(() => Show, (show) => show.schedules)
  show: Show;

  @ManyToOne(() => Hall, (hall) => hall.schedules)
  hall: Hall;
}
