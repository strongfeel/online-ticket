import { Hall } from 'src/hall/entities/hall.entity';
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

  @Column({ type: 'int', nullable: false, unsigned: true })
  hallId: number;

  @Column({ type: 'varchar', nullable: false })
  showName: string;

  @Column({ type: 'varchar', nullable: false })
  image: String;

  @Column({ type: 'varchar', nullable: false })
  showExplain: string;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne((type) => Hall, (hall) => hall.shows, { onDelete: 'CASCADE' })
  // hall: Hall;
}
