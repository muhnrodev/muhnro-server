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
      const projects = await this.prisma.project.findMany({
        include: {
          featuredImage: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              url: true,
              mimeType: true,
              extension: true,
              size: true,
              duration: true,
              width: true,
              height: true,
              altText: true,
              caption: true,
            },
          },
          images: {
            include: {
              media: {
                select: {
                  id: true,
                  filename: true,
                  originalName: true,
                  url: true,
                  mimeType: true,
                  extension: true,
                  size: true,
                  duration: true,
                  width: true,
                  height: true,
                  altText: true,
                  caption: true,
                },
              },
            },
          },
        },
      });

      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects', error);
      throw error;
    }
  }

  async getAllProjectsForClient() {
    try {
      const projects = await this.prisma.project.findMany({
        include: {
          featuredImage: {
            select: {
              url: true,
              path: true,
              size: true,
              mimeType: true,
              caption: true,
              altText: true,
            },
          },
        },
      });
      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects for client', error);
      throw error;
    }
  }

  async getProjectById(projectId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          featuredImage: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              url: true,
              mimeType: true,
              extension: true,
              size: true,
              duration: true,
              width: true,
              height: true,
              altText: true,
              caption: true,
            },
          },
          images: {
            include: {
              media: {
                select: {
                  id: true,
                  filename: true,
                  originalName: true,
                  url: true,
                  mimeType: true,
                  extension: true,
                  size: true,
                  duration: true,
                  width: true,
                  height: true,
                  altText: true,
                  caption: true,
                },
              },
            },
          },
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

      const project = await this.prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
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

        if (data.images && data.images.length > 0) {
          const existingImages = await tx.projectImage.findMany({
            where: {
              projectId: project.id,
              mediaId: { in: data.images },
            },
          });

          const existingImageIds = existingImages.map((image) => image.mediaId);
          const newImageIds = data.images.filter(
            (imageId) => !existingImageIds.includes(imageId),
          );

          if (newImageIds.length > 0) {
            await tx.projectImage.createMany({
              data: newImageIds.map((imageId) => ({
                projectId: project.id,
                mediaId: imageId,
              })),
            });
          }
        }
        return project;
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
      const project = await this.prisma.$transaction(async (tx) => {
        const project = await tx.project.update({
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

        if (data.images) {
          const existingImages = await tx.projectImage.findMany({
            where: { projectId: project.id },
            select: { mediaId: true },
          });

          const existingImageIds = existingImages.map((image) => image.mediaId);
          const incomingImageIds = data.images;

          const imageIdsToDelete = existingImageIds.filter(
            (imageId) => !incomingImageIds.includes(imageId),
          );
          const imageIdsToCreate = incomingImageIds.filter(
            (imageId) => !existingImageIds.includes(imageId),
          );

          if (imageIdsToDelete.length > 0) {
            await tx.projectImage.deleteMany({
              where: {
                projectId: project.id,
                mediaId: { in: imageIdsToDelete },
              },
            });
          }

          if (imageIdsToCreate.length > 0) {
            await tx.projectImage.createMany({
              data: imageIdsToCreate.map((imageId) => ({
                projectId: project.id,
                mediaId: imageId,
              })),
            });
          }
        }

        return project;
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

  async deleteProject(projectId: string) {
    try {
      const existingProject = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!existingProject) {
        this.logger.warn(`Project with ID "${projectId}" not found`);
        throw new Error('Project not found');
      }

      await this.prisma.project.update({
        where: { id: projectId },
        data: { isDeleted: true, deletedAt: new Date() },
      });

      return {
        message: 'Project deleted successfully',
        projects: await this.getAllProjects(),
      };
    } catch (error) {
      this.logger.error('Error deleting project', error);
      throw error;
    }
  }
}
