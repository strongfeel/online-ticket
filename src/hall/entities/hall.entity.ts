import { Schedule } from 'src/schedule/entities/schedule.entity';
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

  @Column({ type: 'int', nullable: false })
  remainingSeat: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany((type) => Show, (show) => show.hall)
  shows: Show[];

  @OneToMany((type) => Schedule, (schedule) => schedule.hall)
  schedules: Schedule[];
}
