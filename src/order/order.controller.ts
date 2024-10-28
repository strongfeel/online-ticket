import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('api')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('orders')
  async order(@UserInfo() user: User, @Body() createOrderDto: CreateOrderDto) {
    const userId = user.id;
    return await this.orderService.create(createOrderDto, userId);
  }
}
