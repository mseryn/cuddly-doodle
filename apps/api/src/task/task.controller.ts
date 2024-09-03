import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/user/:userId')
  async getUserTasks(@Param('userId') userId: string, @Query('date') date: Date) {
    return await this.taskService.getUserTasks(userId, date ? new Date(date) : undefined);
  }

  @Get('/:id')
  async getTask(@Param('id') id: string) {
    return await this.taskService.getTask(id);
  }

  @Post('/:id/done')
  async updateTaskDone(@Param('id') id: string, @Body('done') done: boolean) {
    return await this.taskService.updateTaskDone(id, done);
  }

  @Get('/create')
  async createTasks() {
    return await this.taskService.createTasks();
  }
}
