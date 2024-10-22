import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/createProject.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth';

@ApiTags('projects')
@UseGuards(JwtAuthGuard) 
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



  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      example1: {
        summary: 'Create Project Example',
        value: {
          name: 'Website Redesign',
          members: ['60f8eae2f5d5e35d88e04d90', '60f8eae2f5d5e35d88e04d91'],
          tasks: ['60f8eae2f5d5e35d88e04d93', '60f8eae2f5d5e35d88e04d94'],
        },
      },
    },
  })
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  
}
