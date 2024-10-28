import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('api')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('orders')
  async order(@UserInfo() user: User, @Body() createOrderDto: CreateOrderDto) {
    const userId = user.id;
    return await this.orderService.create(createOrderDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  async findOrder(@UserInfo() user: User) {
    const userId = user.id;
    return await this.orderService.findAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('orders')
  async delete(@UserInfo() user: User, @Query('id') id: number) {
    const userId = user.id;
    return await this.orderService.delete(userId, id);
  }
}
