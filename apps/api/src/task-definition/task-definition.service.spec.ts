import { Test, TestingModule } from '@nestjs/testing';
import { TaskDefinitionService } from './task-definition.service';

describe('TaskDefinitionService', () => {
  let service: TaskDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskDefinitionService],
    }).compile();

    service = module.get<TaskDefinitionService>(TaskDefinitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
