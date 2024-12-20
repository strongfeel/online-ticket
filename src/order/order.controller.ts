import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { TransactionManager } from 'src/utils/transaction.decorator';

@Controller('api')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('orders')
  @UseInterceptors(ClassSerializerInterceptor, TransactionInterceptor)
  async order(
    @UserInfo() user: User,
    @Body() createOrderDto: CreateOrderDto,
    @TransactionManager() transactionManager,
  ) {
    const userId = user.id;
    return await this.orderService.create(
      createOrderDto,
      userId,
      transactionManager,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  async findOrder(@UserInfo() user: User) {
    const userId = user.id;
    return await this.orderService.findAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('orders')
  @UseInterceptors(ClassSerializerInterceptor, TransactionInterceptor)
  async delete(
    @UserInfo() user: User,
    @Query('id') id: number,
    @TransactionManager() transactionManager,
  ) {
    const userId = user.id;
    return await this.orderService.delete(userId, id, transactionManager);
  }

  @Get('seats')
  async findSeats(@Query('id') id: number) {
    return await this.orderService.findSeats(id);
  }
}
