import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TodoistModule } from '../todoist/todoist.module';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TodoistModule],
      providers: [TaskService],
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
