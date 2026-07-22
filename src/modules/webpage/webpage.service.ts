import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateWebpageComponentDto,
  CreateWebpageDto,
  UpdateWebpageDto,
} from './webpage.dto.js';
import { WebsiteService } from '../website/website.service.js';
import { GeneratorService } from '../../common/generator/generator.service.js';

@Injectable()
export class WebpageService {
  private readonly logger = new Logger(WebpageService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly websiteService: WebsiteService,
    private readonly generator: GeneratorService,
  ) {}

  async getAllWebpages() {
    try {
      const webpages = await this.prisma.webpage.findMany({
        include: {
          components: {
            include: {
              component: true,
              values: true,
            },
          },
        },
      });
      return webpages;
    } catch (error) {
      this.logger.error('Error fetching webpages', error);
      throw error;
    }
  }

  async getWebpageById(id: string) {
    try {
      const webpage = await this.prisma.webpage.findUnique({
        where: { id },
        include: {
          components: {
            include: {
              component: true,
              values: true,
            },
          },
        },
      });

      if (!webpage) {
        this.logger.warn(`Webpage with ID ${id} not found`);
        throw new Error(`Webpage with ID ${id} not found`);
      }

      return webpage;
    } catch (error) {
      this.logger.error(`Error fetching webpage with ID ${id}`, error);
      throw error;
    }
  }

  async createWebpage(data: CreateWebpageDto, createdBy: string) {
    try {
      const webpage = await this.prisma.webpage.create({
        data: {
          name: data.name,
          slug: data.slug,
          websiteId: data.websiteId,
          createdBy,
          updatedBy: createdBy,
        },
      });

      const website = await this.websiteService.getWebsiteById(data.websiteId);

      return { message: 'Webpage created successfully', webpage, website };
    } catch (error) {
      this.logger.error('Error creating webpage', error);
      throw error;
    }
  }

  async updateWebpage(data: UpdateWebpageDto, updatedBy: string) {
    try {
      const webpage = await this.prisma.webpage.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug: data.slug,
          websiteId: data.websiteId,
          updatedBy,
        },
      });

      const website = await this.websiteService.getWebsiteById(data.websiteId);

      return { message: 'Webpage updated successfully', webpage, website };
    } catch (error) {
      this.logger.error('Error updating webpage', error);
      throw error;
    }
  }

  async deleteWebpage(id: string) {
    try {
      await this.prisma.webpage.delete({
        where: { id },
      });

      return { message: 'Webpage deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting webpage with ID ${id}`, error);
      throw error;
    }
  }

  async createWebpageComponent(data: CreateWebpageComponentDto) {
    try {
      const webpage = await this.prisma.webpage.findUnique({
        where: { id: data.webpageId },
      });

      if (!webpage) {
        this.logger.warn(`Webpage with ID ${data.webpageId} not found`);
        throw new NotFoundException(
          `Webpage with ID ${data.webpageId} not found`,
        );
      }

      const component = await this.prisma.component.findUnique({
        where: { id: data.componentId },
      });

      if (!component) {
        this.logger.warn(`Component with ID ${data.componentId} not found`);
        throw new NotFoundException(
          `Component with ID ${data.componentId} not found`,
        );
      }

      const webPageComponentKey = await this.generator.generatePageComponentKey(
        data.webpageId,
        data.componentId,
      );

      await this.prisma.$transaction(async (tx) => {
        const webpageComponent = await tx.pageComponent.create({
          data: {
            webpageId: data.webpageId,
            componentId: data.componentId,
            key: webPageComponentKey,
            order: 0,
          },
        });

        for (const field of data.fields) {
          await tx.componentFieldValue.create({
            data: {
              pageComponentId: webpageComponent.id,
              fieldId: field.fieldId,
              value: field.value,
            },
          });
        }
      });

      const updatedWebpage = await this.getWebpageById(data.webpageId);

      return {
        message: 'Webpage component created successfully',
        updatedWebpage,
      };
    } catch (error) {
      this.logger.error('Error creating webpage component', error);
      throw error;
    }
  }
}
