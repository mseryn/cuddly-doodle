import { Injectable } from '@nestjs/common';
import { TodoistService } from '../todoist/todoist.service';

@Injectable()
export class UserService {
  constructor(private readonly todoistService: TodoistService) {}
    
  async getAllUsers(): Promise<Array<{ id: string, name: string, order: number, projectId: string }>> {
    const client = this.todoistService.client;

    return await client.getSections(this.todoistService.projectKey);
  }

  async getUser(id: string): Promise<{ id: string, name: string, order: number, projectId: string } | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }
}
