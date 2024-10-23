import { Injectable } from '@nestjs/common';
import { Task } from './task.dto';
import { TodoistService } from '../todoist/todoist.service';

@Injectable()
export class TaskService {
  constructor(private readonly todoistService: TodoistService) {}

  async getTasks(options: {userId?: string, date?: Date} = {}): Promise<Array<Task>> {
    const client = this.todoistService.client;
    const taskQuery = { projectId: process.env.TODOIST_PROJECT_KEY };

    if (options.userId != null) {
      taskQuery['sectionId'] = options.userId;
    }

    if (options.date != null) {
      taskQuery['filter'] = `due ${options.date.toDateString()}`;
    }

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


    const date = options.date ?? new Date();
    date.setUTCHours(0, 0, 0, 0);
    console.log(result);
    const json = await result.json();
    console.log(json.items);

    const completedResult = await fetch('https://api.todoist.com/sync/v9/completed/get_all?' + new URLSearchParams({ since: date.toISOString() }), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
      },
    });

    const completedTasks = await completedResult.json();
    console.log(completedTasks);


    for (const task of completedTasks.items) {
      console.log(task);
      if (tasks.find(t => t.id === task.id) == null) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  async getUserTasks(userId: string, date?: Date): Promise<Array<Task>> {
    return await this.getTasks({ userId, date });
  }

  async getTask(id: string): Promise<Task> {
    const client = this.todoistService.client;

    return await client.getTask(id);
  }

  async updateTaskDone(id: string, done: boolean): Promise<boolean> {
    const client = this.todoistService.client;

    if (done) {
      return await client.closeTask(id);
    }
    return await client.reopenTask(id);
  }
}
