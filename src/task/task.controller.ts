import { Controller, Get, Param, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('completion-summary')
  @ApiOperation({ summary: 'Fetch the task completion summary grouped by status (To Do, In Progress, Completed)' })
  async getTaskCompletionSummary() {
    return this.taskService.getTaskCompletionSummary();
  }

  @Get('user-performance/:userId')
  @ApiOperation({ summary: 'Get performance report for a user, showing tasks grouped by status' })
  @ApiParam({ name: 'userId', description: 'ID of the user for whom the performance report is being fetched' })
  async getUserPerformanceReport(@Param('userId') userId: string) {
    return this.taskService.getUserPerformanceReport(userId);
  }

  @Get('overdue-tasks')
  @ApiOperation({ summary: 'Fetch summary of overdue tasks grouped by project' })
  async getOverdueTasksSummary() {
    return this.taskService.getOverdueTasksSummary();
  }

  @Get('project-summary/:projectId')
  @ApiOperation({ summary: 'Get task summary for a project grouped by status and members' })
  @ApiParam({ name: 'projectId', description: 'ID of the project for which the task summary is being fetched' })
  async getProjectTaskSummary(@Param('projectId') projectId: string) {
    return this.taskService.getProjectTaskSummary(projectId);
  }
}
