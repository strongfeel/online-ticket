import { Hall } from 'src/hall/entities/hall.entity';
import { OrderInfo } from 'src/orderInfo/entities/orderInfo.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'shows' })
export class Show {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  showName: string;

  @Column({ type: 'varchar', nullable: false })
  image: String;

  @Column({ type: 'varchar', nullable: false })
  showExplain: string;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'int', nullable: false, unsigned: true })
  price: number;

  @Column({ type: 'int', nullable: false })
  remainingSeat: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Hall, (hall) => hall.shows, { onDelete: 'CASCADE' })
  hall: Hall;

  @OneToMany(() => Schedule, (schedule) => schedule.show)
  schedules: Schedule[];

  @OneToMany(() => Seat, (seat) => seat.show)
  seats: Seat[];

  @OneToMany(() => OrderInfo, (orderInfo) => orderInfo.show)
  orderInfos: OrderInfo[];
}
