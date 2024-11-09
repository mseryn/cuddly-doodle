import { Injectable, Res, StreamableFile } from '@nestjs/common';
import { Task } from './task.dto';
import { TodoistService } from '../todoist/todoist.service';
import fs, { createReadStream } from 'fs';
import path from 'path';

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
    } else {
      taskQuery['filter'] = 'due today';
    }

    const tasks = await client.getTasks({ ...taskQuery, projectId: process.env.TODOIST_PROJECT_KEY });

    console.log(tasks);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${process.env.TODOIST_API_KEY}`);
    headers.append('Content-Type', 'application/json');

    const data = new URLSearchParams();
    data.append('resource_types', '["items"]');
    data.append('sync_token', '*');

    /*
    const result = await fetch('https://api.todoist.com/sync/v9/sync', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });


    //console.log(result);
    const json = await result.json();
    //console.log(json.items);
    */
   
    const date = options.date ?? new Date();
    date.setUTCHours(0, 0, 0, 0);

    const completedResult = await fetch('https://api.todoist.com/sync/v9/completed/get_all?' + new URLSearchParams({ since: date.toISOString() }), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
      },
    });

    const completedTasks = await completedResult.json();
    console.log('Completed tasks:', completedTasks);


    for (const task of completedTasks.items) {
      const existingTask = tasks.find(t => t.id === task.task_id);
      if (existingTask) {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        existingTask.isCompleted = new Date(existingTask.due?.date) > endOfToday;
      } else {
        const new_task = await client.getTask(task.task_id);
        tasks.push(new_task);
        //tasks.push(task);
      }
    }

    return tasks;
  }

  async getUserTasks(userId: string, date?: Date): Promise<Array<Task>> {
    return await this.getTasks({ userId, date });
  }

  async getTask(id: string): Promise<Task> {
    const client = this.todoistService.client;

    const task = await client.getTask(id);
    if (task.due?.isRecurring) {
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      task.isCompleted = new Date(task.due?.date) > endOfToday;
    }

    return task
  }

  async updateTaskDone(id: string, done: boolean): Promise<boolean> {
    const client = this.todoistService.client;

    console.warn('Updating task status', id, done);

    if (!done) {
      const task = await client.getTask(id);

      if (task.due?.isRecurring) {
        await client.updateTask(id, { dueString: task.due.string });
        return true
      }
      return await client.reopenTask(id);
    }

    return await client.closeTask(id);
  }

  async getImage(id: string): Promise<StreamableFile> {
    const client = this.todoistService.client;
    const task = await client.getTask(id);

    const filename = task.content.replace(/ /gi, '_').toLowerCase();

    console.log(path.join(__dirname, `assets/images/${filename}.png`));
    if (fs.existsSync(path.join(__dirname, `assets/images/${filename}.png`))) {
      const file = createReadStream(path.join(__dirname, `assets/images/${filename}.png`));
      return new StreamableFile(file, { type: 'image/png' });
    }
    const file = createReadStream(path.join(__dirname, `assets/images/no-image.png`));
    return new StreamableFile(file, { type: 'image/png' });
  }
}
