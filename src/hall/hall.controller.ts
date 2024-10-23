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
  @Post('/admin/hall')
  async createHall(@Body() createHallDto: CreateHallDto) {
    await this.hallService.create(createHallDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/hall:id')
  async updateHall(
    @Param('id') id: number,
    @Body() updateHallDto: UpdateHallDto,
  ) {
    await this.hallService.update(id, updateHallDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/hall:id')
  async deleteHall(@Param('id') id: number) {
    await this.hallService.delete(id);
  }

  @Get('/hall')
  async findAll() {
    return await this.hallService.findAll();
  }
}
