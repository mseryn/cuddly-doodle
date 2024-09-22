import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TodoistModule } from '../todoist/todoist.module';

@Module({
  imports: [TodoistModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
