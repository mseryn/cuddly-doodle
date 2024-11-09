import { Injectable } from '@nestjs/common';
import { TodoistService } from '../todoist/todoist.service';
import { Section } from '@doist/todoist-api-typescript';

@Injectable()
export class UserService {
  constructor(private readonly todoistService: TodoistService) {}
    
  async getAllUsers(): Promise<Array<{ id: string, name: string, order: number, projectId: string, isParent?: boolean }>> {
    const client = this.todoistService.client;

    const parents = process.env.PARENTS.split(';');
    console.warn(parents);

    const sections: Array<Section & { isParent?: boolean }> = await client.getSections(this.todoistService.projectKey);
    for (const section of sections) {
      section.isParent = parents.includes(section.id);
    }

    console.warn(sections)

    return sections
  }

  async getUser(id: string): Promise<{ id: string, name: string, order: number, projectId: string } | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }
}
