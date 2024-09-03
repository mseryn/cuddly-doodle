import { Module } from '@nestjs/common';
import { TaskDefinitionService } from './task-definition.service';

@Module({
  providers: [TaskDefinitionService]
})
export class TaskDefinitionModule {}
