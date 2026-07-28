import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateWebsiteDto } from './dto/create-website.dto.js';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllWebsites() {
    try {
      const websites = await this.prisma.website.findMany({
        include: {
          pages: true,
        },
      });
      return websites;
    } catch (error) {
      this.logger.error('Error fetching websites', error);
      throw error;
    }
  }

  async getWebsiteById(id: string) {
    try {
      const website = await this.prisma.website.findUnique({
        where: { id },
        include: {
          pages: true,
        },
      });

      if (!website) {
        this.logger.warn(`Website with ID ${id} not found`);
        throw new NotFoundException(`Website with ID ${id} not found`);
      }

      return website;
    } catch (error) {
      this.logger.error(`Error fetching website with ID ${id}`, error);
      throw error;
    }
  }

  async createWebsite(data: CreateWebsiteDto, createdBy: string) {
    try {
      await this.prisma.website.create({
        data: {
          name: data.name,
          description: data.description,
          domain: data.domain,
          createdBy,
          updatedBy: createdBy,
        },
      });

      const websites = await this.getAllWebsites();

      return { message: 'Website created successfully', websites };
    } catch (error) {
      this.logger.error('Error creating website', error);
      throw error;
    }
  }

  async getWebsiteContentById(id: string) {
    try {
      const website = await this.prisma.website.findUnique({
        where: { id },
        include: {
          pages: {
            include: {
              components: {
                include: {
                  component: true,
                  values: {
                    include: {
                      field: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!website) {
        this.logger.warn(`Website with ID ${id} not found`);
        throw new NotFoundException(`Website with ID ${id} not found`);
      }

      const data = {
        name: website.name,
        domain: website.domain,
        id: website.id,
        version: website.version,
        pages: website.pages.map((page) => ({
          id: page.id,
          name: page.name,
          slug: page.slug,
          components: page.components.map((component) => ({
            id: component.id,
            key: component.key,
            active: component.active,
            componentId: component.componentId,
            fields: component.values.map((value) => ({
              fieldId: value.fieldId,
              label: value.field.label,
              value: value.value,
            })),
          })),
        })),
      };

      return data;
    } catch (error) {
      this.logger.error(`Error fetching website content with ID ${id}`, error);
      throw error;
    }
  }

  async incrementWebsiteVersion(id: string) {
    try {
      const website = await this.prisma.website.findUnique({
        where: { id },
      });

      if (!website) {
        this.logger.warn(`Website with ID ${id} not found`);
        throw new NotFoundException(`Website with ID ${id} not found`);
      }

      const updatedWebsite = await this.prisma.website.update({
        where: { id },
        data: {
          version: website.version + 1,
        },
      });

      return updatedWebsite;
    } catch (error) {
      this.logger.error(
        `Error incrementing version for website with ID ${id}`,
        error,
      );
      throw error;
    }
  }
}
