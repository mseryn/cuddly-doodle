import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { TodoistService } from '../todoist/todoist.service';

@Injectable()
export class UserService {
  constructor(private readonly todoistService: TodoistService) {}
    
  async getAllUsers(): Promise<Array<{ id: string, name: string, email: string }>> {
    const client = this.todoistService.client;

    console.log(await client.getProjects());

    return await client.getProjectCollaborators(this.todoistService.projectKey);
  }

  async getUser(id: string): Promise<{ id: string, name: string, email: string } | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }
}
