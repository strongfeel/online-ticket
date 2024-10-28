import { Order } from 'src/order/entities/order.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orderSeats' })
export class OrderSeat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ManyToOne(() => Order, (order) => order.orderSeats, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Seat, (seat) => seat.orderSeats)
  seat: Seat;
}
