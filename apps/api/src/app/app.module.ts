import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path'
console.log(path.join(__dirname, '..', 'cuddly-doodle', 'browser'))

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'cuddly-doodle', 'browser'),
    }),
    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
