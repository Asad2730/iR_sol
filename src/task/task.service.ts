import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CacheService } from 'src/cache/cache.service'; 
import { CreateTaskDto } from './dto/task.dto';

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
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
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
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }
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

async addTask(createTaskDto: CreateTaskDto): Promise<Task> {
  const { title, dueDate, status, assignedTo, project } = createTaskDto;

  if (assignedTo && !Types.ObjectId.isValid(assignedTo)) {
    throw new BadRequestException('Invalid user ID');
  }

  if (project && !Types.ObjectId.isValid(project)) {
    throw new BadRequestException('Invalid project ID');
  }

  const newTask = new this.taskModel({
    title,
    dueDate,
    status,
    assignedTo: assignedTo ? new Types.ObjectId(assignedTo) : null,
    project: project ? new Types.ObjectId(project) : null,
  });

 
  return newTask.save();
}


async assignTaskToUser(taskId: string, userId: string) {

  if (!Types.ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  const updatedTask = await this.taskModel.findByIdAndUpdate(
    taskId,
    { assignedTo: new Types.ObjectId(userId) },
    { new: true } 
  );

  if (!updatedTask) {
    throw new Error(`Task with ID ${taskId} not found`);
  }

  return updatedTask;
}

}