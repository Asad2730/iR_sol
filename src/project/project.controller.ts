import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId/summary')
  @ApiOperation({ summary: 'Get task summary for a project with pagination' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit for pagination' })
  async getProjectTaskSummary(
    @Param('projectId') projectId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.projectService.getProjectTaskSummary(projectId, +page, +limit);
  }
}
