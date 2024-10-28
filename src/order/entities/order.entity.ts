import { Hall } from 'src/hall/entities/hall.entity';
import { OrderSeat } from 'src/orderSeat/entities/orderSeat.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  totalPrice: number;

  @Column({ type: 'boolean', nullable: false })
  orderState: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Payment, (payment) => payment.orders)
  payment: Payment;

  @ManyToOne(() => Hall, (hall) => hall.orders)
  hall: Hall;

  @OneToMany(() => OrderSeat, (orderSeat) => orderSeat.order)
  orderSeats: OrderSeat[];
}
