import {
  Body,
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
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { HallService } from './hall.service';
import { TransactionManager } from 'src/utils/transaction.decorator';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { EntityManager } from 'typeorm';

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
  @UseInterceptors(TransactionInterceptor)
  async updateHall(
    @Query('id') id: number,
    @Body() updateHallDto: UpdateHallDto,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return await this.hallService.update(id, updateHallDto, transactionManager);
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
