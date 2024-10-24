import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'points' })
export class Point {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  pointDetails: number;

  @Column({ type: 'int', default: 1000000, nullable: false, unsigned: true })
  totalPoint: number;

  @Column({ type: 'varchar', nullable: false })
  reason: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.points)
  user: User;
}
