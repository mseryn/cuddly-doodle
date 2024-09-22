import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Task } from './task.model';
import { TaskDefinition } from '../task-definition/task-definition.model';
import { User } from '../user/user.model';
import { TodoistService } from '../todoist/todoist.service';

@Injectable()
export class TaskService {
  constructor(private readonly todoistService: TodoistService) {}

  async getTasks() {
    const client = this.todoistService.client;
    const tasks = await client.getTasks({ projectId: process.env.TODOIST_PROJECT_KEY });

    console.log(tasks);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${process.env.TODOIST_API_KEY}`);
    headers.append('Content-Type', 'application/json');

    const data = new URLSearchParams();
    data.append('resource_types', '["items"]');
    data.append('sync_token', '*');

    const result = await fetch('https://api.todoist.com/sync/v9/sync', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });


    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    console.log(result);
    const json = await result.json();
    console.log(json.items);

    const completedResult = await fetch('https://api.todoist.com/sync/v9/completed/get_all?' + new URLSearchParams({ since: today.toISOString() }), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
      },
      
    });

    const completedTasks = await completedResult.json();
    console.log(completedTasks);

    return tasks;
  }

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
