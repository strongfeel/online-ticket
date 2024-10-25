import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('api')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('/admin/schedule')
  async createShow(@Body() createScheduleDto: CreateScheduleDto) {
    return await this.scheduleService.create(createScheduleDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/schedule/:id')
  async updateShow(
    @Param('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return await this.scheduleService.update(id, updateScheduleDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/schedule/:id')
  async deleteShow(@Param('id') id: number) {
    return await this.scheduleService.delete(id);
  }

  @Get('/schedule')
  async findSchedule(
    @Body('hallId') hallId: number,
    @Body('showId') showId: number,
  ) {
    return await this.scheduleService.findSchedule(hallId, showId);
  }
}
