import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post('/')
  async createUser(@Body() body: any) {
    return await this.userService.createUser(body.name, body.avatar);
  }
}
