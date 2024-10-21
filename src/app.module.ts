import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv'


dotenv.config();
@Module({
    imports: [
      MongooseModule.forRoot(process.env.MONGO_URL),
      AuthModule,
      UserModule,
      TaskModule,
      ProjectModule,
      CacheModule,
    ],
  })
  export class AppModule {}