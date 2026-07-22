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
}
