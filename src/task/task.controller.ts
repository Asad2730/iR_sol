import { Body, Controller, Get, Param, Patch, Query,Post, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard) 
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

  @Post('add')
  @ApiOperation({ summary: 'Add a new task' })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      example1: {
        summary: 'Add Task Example',
        value: {
          title: 'New Task',
          dueDate: '2024-10-31',
          status: 'To Do',
          assignedTo: '60f8eae2f5d5e35d88e04d90', 
          project: '60f8eae2f5d5e35d88e04d91',  
        },
      },
    },
  })
  async addTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.addTask(createTaskDto);
  }


  @Patch(':taskId/assign')
  @ApiOperation({ summary: 'Assign task to a user' })
  @ApiParam({ name: 'taskId', description: 'ID of the task to assign' })
  @ApiBody({ schema: { example: { userId: '60f8eae2f5d5e35d88e04d90' } } }) 
  async assignTaskToUser(
    @Param('taskId') taskId: string,
    @Body('userId') userId: string
  ) {
    return this.taskService.assignTaskToUser(taskId, userId);
  }

}
