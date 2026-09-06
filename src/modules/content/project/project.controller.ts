import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get('client')
  async getAllProjectsForClient() {
    return this.projectService.getAllProjectsForClient();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(@Body() data: CreateProjectDto) {
    return this.projectService.createProject(data);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProject(@Body() data: UpdateProjectDto) {
    return this.projectService.updateProject(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProject(@Param('id') projectId: string) {
    return this.projectService.deleteProject(projectId);
  }
}
