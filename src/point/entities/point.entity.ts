import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'points' })
export class Point {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false, unsigned: true })
  userId: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  pointDetails: number;

  @Column({ type: 'int', default: 1000000, nullable: false, unsigned: true })
  totalPoint: number;

  @Column({ type: 'varchar', nullable: false })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.points, { onDelete: 'CASCADE' })
  user: User;
}
