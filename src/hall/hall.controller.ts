import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { UpdateHallDto } from './dto/update-hall.dto';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('api')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('/admin/halls')
  async createHall(@Body() createHallDto: CreateHallDto) {
    return await this.hallService.create(createHallDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/halls')
  async updateHall(
    @Query('id') id: number,
    @Body() updateHallDto: UpdateHallDto,
  ) {
    return await this.hallService.update(id, updateHallDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/halls')
  async deleteHall(@Query('id') id: number) {
    return await this.hallService.delete(id);
  }

  @Get('/halls')
  async findAll() {
    return await this.hallService.findAll();
  }
}
