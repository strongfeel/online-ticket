import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  paymentName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany((type) => Order, (order) => order.payment)
  orders: Order[];
}
