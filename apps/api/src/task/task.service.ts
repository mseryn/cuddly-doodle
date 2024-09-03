import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Task } from './task.model';
import { TaskDefinition } from '../task-definition/task-definition.model';
import { User } from '../user/user.model';

@Injectable()
export class TaskService {
  async getUserTasks(userId: string, date?: Date) {
    const where: WhereOptions<Task> = { userId };

    if (date) {
      where.date = date;
    }

    return await Task.findAll({ where });
  }

  async getTask(id: string): Promise<Task> {
    return await Task.findByPk(id);
  }

  async updateTaskDone(id: string, done: boolean): Promise<Task> {
    const task = await this.getTask(id);
    task.done = done;
    await task.save();
    return task;
  }

  async needsTask(user: User, definition: TaskDefinition): Promise<boolean> {
    const tasks = await Task.findAll({
      where: {
        userId: user.id,
        taskDefinitionId: definition.id,
        date: new Date().setUTCHours(0, 0, 0, 0),
      },
    });
    return tasks.length === 0;
  }

  async createTasks() {
    const definitions = await TaskDefinition.findAll({
      include: [User],
    });
    for (const definition of definitions) {
      for (const user of definition.users) {
        if (this.needsTask(user, definition)) {
          const task = new Task({
            taskDefinitionId: definition.id,
            userId: user.id,
            done: false,
          });
          await task.save();
        }
      }
    }
  }
}
