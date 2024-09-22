import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TodoistModule } from '../todoist/todoist.module';

@Module({
  imports: [TodoistModule],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule {}
