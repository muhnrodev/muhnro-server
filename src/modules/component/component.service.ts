import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateComponentDto } from './component.dto.js';

@Injectable()
export class ComponentService {
  private readonly logger = new Logger(ComponentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllComponents() {
    try {
      const components = await this.prisma.component.findMany();
      return components;
    } catch (error) {
      this.logger.error('Error fetching components', error);
      throw error;
    }
  }

  async getComponentById(id: string) {
    try {
      const component = await this.prisma.component.findUnique({
        where: { id },
      });

      if (!component) {
        this.logger.warn(`Component with ID ${id} not found`);
        throw new Error(`Component with ID ${id} not found`);
      }

      return component;
    } catch (error) {
      this.logger.error(`Error fetching component with ID ${id}`, error);
      throw error;
    }
  }

  async getComponentByKey(key: string) {
    try {
      const component = await this.prisma.component.findUnique({
        where: { key },
        include: {
          fields: true,
        },
      });

      if (!component) {
        this.logger.warn(`Component with key ${key} not found`);
        throw new Error(`Component with key ${key} not found`);
      }

      return component;
    } catch (error) {
      this.logger.error(`Error fetching component with key ${key}`, error);
      throw error;
    }
  }

  async createComponent(data: CreateComponentDto, createdBy: string) {
    try {
      const componentKey = await this.generateComponentKey(data.name);

      await this.prisma.component.create({
        data: {
          name: data.name,
          description: data.description,
          key: componentKey,
        },
      });

      const components = await this.getAllComponents();

      return {
        message: 'Component created successfully',
        components,
      };
    } catch (error) {
      this.logger.error('Error creating component', error);
      throw error;
    }
  }

  async generateComponentKey(name: string): Promise<string> {
    const slug = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');

    const exists = await this.prisma.component.findUnique({
      where: { key: slug },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }
}
