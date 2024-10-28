import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('api')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('/admin/payments')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/payments')
  async deletePayment(@Query('id') id: number) {
    return await this.paymentService.delete(id);
  }
}
