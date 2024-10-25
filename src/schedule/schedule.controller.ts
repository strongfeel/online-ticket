import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('api')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/schedules')
  async updateShow(
    @Query('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return await this.scheduleService.update(id, updateScheduleDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/schedules')
  async deleteShow(@Query('id') id: number) {
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
