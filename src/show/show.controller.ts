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
import { ShowService } from './show.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';

@Controller('api')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('/admin/show')
  async createShow(@Body() createShowDto: CreateShowDto) {
    return await this.showService.create(createShowDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/admin/show/:id')
  async updateShow(
    @Param('id') id: number,
    @Body() updateShowDto: UpdateShowDto,
  ) {
    return await this.showService.update(id, updateShowDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/admin/show/:id')
  async deleteShow(@Param('id') id: number) {
    return await this.showService.delete(id);
  }

  @Get('/show/all')
  async findAll() {
    return await this.showService.findAll();
  }

  @Get('/show/category/:category')
  async findCategory(@Param('category') category: string) {
    return await this.showService.findCategory(category);
  }

  @Get('/show/:id')
  async findOne(@Param('id') id: number) {
    return await this.showService.findOne(id);
  }

  @Get('/show/search/:showName')
  async searchShowName(@Param('showName') showName: string) {
    return await this.showService.searchShowName(showName);
  }
}
