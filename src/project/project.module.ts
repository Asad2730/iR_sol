import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project, ProjectSchema } from './schemas/project.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from 'src/cache/cache.module';
import { Task, TaskSchema } from 'src/task/schemas/task.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

import { TaskModule } from 'src/task/task.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    CacheModule,
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports:[ProjectService]
})
export class ProjectModule {}
