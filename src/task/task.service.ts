import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CacheService } from 'src/cache/cache.service'; 

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly cacheService: CacheService, 
  ) {}

  
  async getTaskCompletionSummary() {
    const cacheKey = 'taskCompletionSummary';
    const cachedData = await this.cacheService.getCache(cacheKey); 
    if (cachedData) {
      return cachedData; 
    }

   
    const summary = await this.taskModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    await this.cacheService.setCache(cacheKey, summary, 3600); 

    return summary; 
  }

  async getUserPerformanceReport(userId: string) {
    return this.taskModel.aggregate([
      { $match: { assignedTo: new Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }

  async getOverdueTasksSummary() {
    const today = new Date();
    return this.taskModel.aggregate([
      { $match: { dueDate: { $lt: today }, status: { $ne: 'Completed' } } },
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'project',
        },
      },
    ]);
  }

  async getProjectTaskSummary(projectId: string) {
    const cacheKey = `projectTaskSummary_${projectId}`;
    const cachedData = await this.cacheService.getCache(cacheKey);
    if (cachedData) {
      return cachedData; 
    }

    const summary = await this.taskModel.aggregate([
      { $match: { project: new Types.ObjectId(projectId) } },
      {
        $facet: {
          statusSummary: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          memberContribution: [
            { $group: { _id: '$assignedTo', completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } } } },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user',
              },
            },
          ],
        },
      },
    ]);

    
    await this.cacheService.setCache(cacheKey, summary, 3600);

    return summary; 
}

}