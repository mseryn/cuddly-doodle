import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TodoistModule } from '../todoist/todoist.module';
import schedule from 'node-schedule';

@Module({
  imports: [TodoistModule],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule {

  constructor(taskService: TaskService) {
    schedule.scheduleJob('reschedule_overdue', '3 * * * *', async () => {
      await taskService.rescheduleOverdue();
    });
  }
}
