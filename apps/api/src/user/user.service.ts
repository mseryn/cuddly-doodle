import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  async getAllUsers(): Promise<Array<User>> {
    return await User.findAll();
  }

  async getUser(id: string): Promise<User> {
    return await User.findByPk(id);
  }

  async createUser(name: string, avatar: Buffer): Promise<User> {
    return await User.create({ name, avatar });
  }
}
