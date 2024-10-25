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
import { TransactionManager } from 'src/utils/transaction.decorator';
import { TransactionInterceptor } from 'src/utils/transaction.interceptor';
import { EntityManager } from 'typeorm';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ShowService } from './show.service';

@Controller('api')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('/admin/shows')
  @UseInterceptors(TransactionInterceptor)
  async createShow(
    @Body() createShowDto: CreateShowDto,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return await this.showService.create(createShowDto, transactionManager);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/shows')
  async updateShow(
    @Query('id') id: number,
    @Body() updateShowDto: UpdateShowDto,
  ) {
    return await this.showService.update(id, updateShowDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/shows')
  async deleteShow(@Query('id') id: number) {
    return await this.showService.delete(id);
  }

  @Get('/shows/all')
  async findAll() {
    return await this.showService.findAll();
  }

  @Get('/shows/category')
  async findCategory(@Query('category') category: string) {
    return await this.showService.findCategory(category);
  }

  @Get('/shows')
  async findOne(@Query('id') id: number) {
    return await this.showService.findOne(id);
  }

  @Get('/shows/search')
  async searchShowName(@Query('showName') showName: string) {
    return await this.showService.searchShowName(showName);
  }
}
