import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@UserInfo() user: User) {
    return await this.userService.getUser(user);
  }
}
