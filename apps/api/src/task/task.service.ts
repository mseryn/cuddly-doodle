import { Injectable, StreamableFile } from '@nestjs/common';
import { Task } from './task.dto';
import { TodoistService } from '../todoist/todoist.service';
import fs, { createReadStream } from 'fs';
import path from 'path';


const afterDate = (date: Date, after?: Date, utc = false): boolean => {
  if (after == null) {
    after = new Date()
  }
  after = new Date(after);
  if (utc) {
    after.setHours(0, 0, 0, 0);
    after.setUTCHours(23,59,59,999);
  } else {
    after.setHours(23,59,59,999)
  }
  console.log(`Comparing ${date.toISOString()} > ${after.toISOString()}`);
  return date > after;
}



@Injectable()
export class TaskService {
  constructor(private readonly todoistService: TodoistService) {}

  async getTasks(options: {userId?: string, date?: Date, filter?: string} = {}): Promise<Array<Task>> {
    const client = this.todoistService.client;
    const taskQuery = { projectId: process.env.TODOIST_PROJECT_KEY };
    let labels = []

    if (options.userId != null) {
      taskQuery['sectionId'] = options.userId;
    }

    if (options.filter != null) {
      taskQuery['filter'] = options.filter;
    } else if (options.date != null) {
      taskQuery['filter'] = `due ${options.date.toDateString()}`;
    } else {
      const date = new Date();
      let timeFilter = ' & (@morning | !@afternoon)'
      labels = ['morning']
      if (date.getHours() >= 13) {
        labels = ['afternoon']
        timeFilter = ' & (@afternoon | !@morning)'
      }
      taskQuery['filter'] = 'due today' + timeFilter;
    }

    const tasks = await client.getTasks({ ...taskQuery, projectId: process.env.TODOIST_PROJECT_KEY });

    //console.log(tasks);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${process.env.TODOIST_API_KEY}`);
    headers.append('Content-Type', 'application/json');

    const data = new URLSearchParams();
    data.append('resource_types', '["user_plan_limits"]');
    data.append('sync_token', '*');

    
    /*
    const results = await fetch('https://api.todoist.com/sync/v9/sync', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });


    //console.log(result);
    const json = await results.json();
    console.log(json);
    */
    const object_ids: Record<string, boolean> = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let cursor = undefined;
    let foundOld = false;
    while (!foundOld) {
      const params = new URLSearchParams({
        object_type: 'item',
        page: '0',
        event_type: 'completed',
        annotate_notes: 'true',
        annotate_parents: 'true',
        limit: '30',
        parent_project_id: process.env.TODOIST_PROJECT_KEY,
      });

      if (cursor) {
        params.append('cursor', cursor);
      }

      const activitiesurl =
        'https://app.todoist.com/api/v1/activities?' + params;

      console.log('Fetching activities from ', activitiesurl);

      const result = await fetch(activitiesurl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
        },
      });

      console.log(JSON.stringify(tasks, null, 4));

      const activityresult = await result.json();
      cursor = activityresult.next_cursor;

      console.log(JSON.stringify(activityresult, null, 4))

      for (const completed of activityresult.results) {
        if (!afterDate(new Date(completed.event_date), yesterday)) {
          // Results are reverse timestamp ordered
          foundOld = true
          break;
        }
        if (object_ids[completed.object_id]) {
          continue;
        }
        object_ids[completed.object_id] = true;
        const task = await client.getTask(completed.object_id);
        if (task && task.labels.some((label) => labels.includes(label))) {
          const existingTask = tasks.find((t) => t.id === task.id);
          if (!existingTask) {
            task.isCompleted =
              task.isCompleted || afterDate(new Date(task.due?.date), null, true);
            tasks.push(task);
          }
        }
      }
    }
   
    const date = options.date ?? new Date();
    date.setHours(0, 0, 0, 0);

    /*
    const completedResult = await fetch('https://api.todoist.com/sync/v9/completed/get_all?' + new URLSearchParams({ since: date.toISOString() }), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
      },
    });

    const completedTasks = await completedResult.json();
    //console.log('Completed tasks:', completedTasks);


    for (const task of completedTasks.items) {
      const existingTask = tasks.find(t => t.id === task.task_id);
      if (existingTask != null) {
        existingTask.isCompleted = afterToday(new Date(existingTask.due?.date))
      } else {
        const new_task = await client.getTask(task.task_id);
        console.log('New task:', new_task.isCompleted);
        new_task.isCompleted = afterToday(new Date(new_task.due?.date))
        tasks.push(new_task);
      }
    }
    */

    return tasks;
  }

  async getUserTasks(userId: string, date?: Date): Promise<Array<Task>> {
    return await this.getTasks({ userId, date });
  }

  async getTask(id: string): Promise<Task> {
    const client = this.todoistService.client;

    const task = await client.getTask(id);
    if (task.due?.isRecurring) {
      task.isCompleted = afterDate(new Date(task.due?.date), null, true)
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

    let filename = task.content

    if (task.description) {
      const parts = task.description.split(' ')
      for (const part of parts) {
        if (part.startsWith('image:')) {
          filename = part.split(':', 2)[1];
          break;
        }
      }
    }

    filename = filename.replace(/ /gi, '_').toLowerCase();

    console.log(path.join(__dirname, `assets/images/${filename}.png`));
    if (fs.existsSync(path.join(__dirname, `assets/images/${filename}.png`))) {
      const file = createReadStream(path.join(__dirname, `assets/images/${filename}.png`));
      return new StreamableFile(file, { type: 'image/png' });
    }
    const file = createReadStream(path.join(__dirname, `assets/images/no-image.png`));
    return new StreamableFile(file, { type: 'image/png' });
  }

  async rescheduleOverdue(): Promise<void> {
    const overdue = await this.getTasks({ filter: 'overdue & recurring' });

    for (const task of overdue) {
      await this.todoistService.client.updateTask(task.id, { dueString: task.due.string });
    }

  }
}
