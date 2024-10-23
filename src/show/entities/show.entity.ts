import { Hall } from 'src/hall/entities/hall.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Hall, (hall) => hall.shows)
  hall: Hall;
}
