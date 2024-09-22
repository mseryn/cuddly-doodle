import { Injectable } from '@nestjs/common';
import { TodoistApi } from "@doist/todoist-api-typescript"

@Injectable()
export class TodoistService {
  client: TodoistApi;
  constructor() {
    this.client = new TodoistApi(process.env.TODOIST_API_KEY);
  }

  get projectKey() {
    return process.env.TODOIST_PROJECT_KEY;
  }
}
