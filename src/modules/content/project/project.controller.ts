import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Post()
  async createProject(@Body() data: CreateProjectDto) {
    return this.projectService.createProject(data);
  }
}
