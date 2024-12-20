import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { TransactionManager } from 'src/utils/transaction.decorator';

@Controller('api')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor, TransactionInterceptor)
  @Post('/admin/schedules')
  async createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
    @TransactionManager() transactionManager,
  ) {
    return await this.scheduleService.create(
      createScheduleDto,
      transactionManager,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/schedules')
  async updateSchedule(
    @Query('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return await this.scheduleService.update(id, updateScheduleDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/schedules')
  async deleteSchedule(@Query('id') id: number) {
    return await this.scheduleService.delete(id);
  }

  @Get('/schedules')
  async findSchedule(
    @Query('hallId') hallId: number,
    @Query('showId') showId: number,
  ) {
    return await this.scheduleService.findSchedule(hallId, showId);
  }
}
