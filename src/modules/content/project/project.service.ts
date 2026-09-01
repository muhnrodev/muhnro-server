import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { GeneratorService } from 'src/common/generator/generator.service';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly generator: GeneratorService,
  ) {}

  async getAllProjects() {
    try {
      const projects = await this.prisma.project.findMany();
      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects', error);
      throw error;
    }
  }

  async getProjectById(projectId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          featuredImage: true,
        },
      });
      return project;
    } catch (error) {
      this.logger.error('Error fetching project by ID', error);
      throw error;
    }
  }

  async createProject(data: CreateProjectDto) {
    try {
      const slug = await this.generator.generateProjectSlug(data.title);

      const project = await this.prisma.project.create({
        data: {
          title: data.title,
          subtitle: data.subtitle,
          code: data.code,
          budget: data.budget ?? 0,
          story: data.story,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          clientId: data.clientId,
          projectLeadId: data.projectLeadId,
          industryId: data.industryId,
          locationId: data.locationId,
          featuredImageId: data.featuredImageId,
          slug: slug,
          serviceSummary: data.serviceSummary,
        },
      });

      return {
        message: 'Project created successfully',
        project,
        projects: await this.getAllProjects(),
      };
    } catch (error) {
      this.logger.error('Error creating project', error);
      throw error;
    }
  }

  async updateProject(data: UpdateProjectDto) {
    try {
      const project = await this.prisma.project.update({
        where: { id: data.id },
        data: {
          title: data.title,
          subtitle: data.subtitle,
          code: data.code,
          budget: data.budget ?? 0,
          story: data.story,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          clientId: data.clientId,
          projectLeadId: data.projectLeadId,
          industryId: data.industryId,
          locationId: data.locationId,
          featuredImageId: data.featuredImageId,
          serviceSummary: data.serviceSummary,
        },
      });

      return {
        message: 'Project updated successfully',
        project,
        projects: await this.getAllProjects(),
      };
    } catch (error) {
      this.logger.error('Error updating project', error);
      throw error;
    }
  }
}
