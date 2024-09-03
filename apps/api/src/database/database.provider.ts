import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { TaskDefinition } from '../task-definition/task-definition.model';
import { Task } from '../task/task.model';
import { UserTaskDefinition } from '../task-definition/userTaskDefinition.model';
import ImageModel from '../image/image.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST ?? 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        username: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? 'root',
        database: process.env.DB_DATABASE ?? 'cuddlydoodle',
      });
      sequelize.addModels([User, Task, TaskDefinition, UserTaskDefinition, ImageModel]);
      try {
        sequelize.sync();
      } catch (error) {
        console.error('Error syncing database:', error);
        throw error;
      }
      return sequelize;
    },
  },
];
