import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  async getTasks() {
    return await this.taskService.getTasks();
  }

  @Get('/user/:userId')
  async getUserTasks(@Param('userId') userId: string, @Query('date') date: Date): Promise<Array<Task>> {
    return await this.taskService.getUserTasks(userId, date ? new Date(date) : undefined);
  }

  @Get('/:id')
  async getTask(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getTask(id);
  }

  @Post('/:id/done')
  async updateTaskDone(@Param('id') id: string, @Body('done') done: boolean): Promise<boolean> {
    return await this.taskService.updateTaskDone(id, done);
  }

  @Get('/:id/image')
  async getTaskImage(@Param('id') id: string) {
    return await this.taskService.getImage(id);
  }
}
