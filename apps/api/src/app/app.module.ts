import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { TaskModule } from '../task/task.module';
import { TaskDefinitionModule } from '../task-definition/task-definition.module';
import { UserModule } from '../user/user.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [DatabaseModule, TaskModule, TaskDefinitionModule, UserModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
