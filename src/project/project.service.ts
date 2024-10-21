import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Task } from '../task/schemas/task.schema';
import { CacheService } from 'src/cache/cache.service';


@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly redisService: CacheService,
  ) {}

  async getProjectTaskSummary(projectId: string, page: number, limit: number) {
   
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const cacheKey = `project_${projectId}_task_summary_${page}_${limit}`;
    
    const cachedData = await this.redisService.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const projectIdObject = new Types.ObjectId(projectId);
    const skip = (page - 1) * limit;

    const projectTaskSummary = await this.taskModel.aggregate([
      { $match: { project: projectIdObject } },
      {
        $facet: {
          statusSummary: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $skip: skip },
            { $limit: limit },
          ],
          memberContribution: [
            { $group: { _id: '$assignedTo', completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 0, name: '$user.name', completedTasks: 1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    await this.redisService.setCache(cacheKey, projectTaskSummary, 3600); 
    return projectTaskSummary;
  }
}
