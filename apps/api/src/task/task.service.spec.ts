import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TodoistModule } from '../todoist/todoist.module';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TodoistModule],
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
