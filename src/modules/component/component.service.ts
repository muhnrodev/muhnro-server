import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateComponentDto,
  CreateComponentFieldDto,
  UpdateComponentDto,
  UpdateComponentFieldDto,
} from './component.dto.js';
import { GeneratorService } from '../../common/generator/generator.service.js';

@Injectable()
export class ComponentService {
  private readonly logger = new Logger(ComponentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly generator: GeneratorService,
  ) {}

  async getAllComponents() {
    try {
      const components = await this.prisma.component.findMany({
        include: {
          fields: {
            include: {},
          },
        },
      });

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
        include: {
          fields: {
            include: {},
          },
        },
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
          fields: {
            include: {},
          },
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
      const componentKey = await this.generator.generateComponentKey(data.name);

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

  async updateComponent(data: UpdateComponentDto) {
    try {
      const component = await this.prisma.component.findUnique({
        where: { id: data.id },
      });

      if (!component) {
        this.logger.warn(`Component with ID ${data.id} not found`);
        throw new Error(`Component with ID ${data.id} not found`);
      }

      const componentKey = await this.generator.generateComponentKey(data.name);

      await this.prisma.component.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          key: componentKey,
        },
      });

      const updatedComponent = await this.getComponentById(data.id);
      const components = await this.getAllComponents();

      return {
        message: 'Component updated successfully',
        component: updatedComponent,
        components,
      };
    } catch (error) {
      this.logger.error('Error updating component', error);
      throw error;
    }
  }

  async deleteComponent(id: string) {
    try {
      const component = await this.prisma.component.findUnique({
        where: { id },
      });

      if (!component) {
        this.logger.warn(`Component with ID ${id} not found`);
        throw new Error(`Component with ID ${id} not found`);
      }

      await this.prisma.component.delete({
        where: { id },
      });

      const components = await this.getAllComponents();

      return {
        message: 'Component deleted successfully',
        components,
      };
    } catch (error) {
      this.logger.error('Error deleting component', error);
      throw error;
    }
  }

  async createComponentField(data: CreateComponentFieldDto) {
    try {
      const component = await this.prisma.component.findUnique({
        where: { id: data.componentId },
      });

      if (!component) {
        this.logger.warn(`Component with ID ${data.componentId} not found`);
        throw new Error(`Component with ID ${data.componentId} not found`);
      }

      const fieldKey = await this.generator.generateComponentFieldKey(
        data.label,
        data.componentId,
      );

      const newField = await this.prisma.componentField.create({
        data: {
          componentId: data.componentId,
          label: data.label,
          type: data.type,
          required: data.required,
          minLength: data.minLength,
          maxLength: data.maxLength,
          minValue: data.minValue,
          maxValue: data.maxValue,
          regex: data.regex,
          key: fieldKey,
        },
      });

      const updatedComponent = await this.getComponentById(data.componentId);
      const components = await this.getAllComponents();

      return {
        message: 'Component field created successfully',
        component: updatedComponent,
        components,
      };
    } catch (error) {
      this.logger.error('Error creating component field', error);
      throw error;
    }
  }

  async updateComponentField(data: UpdateComponentFieldDto) {
    try {
      const field = await this.prisma.componentField.findUnique({
        where: { id: data.id },
      });

      if (!field) {
        this.logger.warn(`Component field with ID ${data.id} not found`);
        throw new Error(`Component field with ID ${data.id} not found`);
      }

      const fieldKey = await this.generator.generateComponentFieldKey(
        data.label,
        field.componentId,
      );

      await this.prisma.componentField.update({
        where: { id: data.id },
        data: {
          label: data.label,
          type: data.type,
          required: data.required,
          minLength: data.minLength,
          maxLength: data.maxLength,
          minValue: data.minValue,
          maxValue: data.maxValue,
          regex: data.regex,
          key: fieldKey,
        },
      });

      const updatedComponent = await this.getComponentById(field.componentId);
      const components = await this.getAllComponents();

      return {
        message: 'Component field updated successfully',
        component: updatedComponent,
        components,
      };
    } catch (error) {
      this.logger.error('Error updating component field', error);
      throw error;
    }
  }

  async deleteComponentField(fieldId: string) {
    try {
      const field = await this.prisma.componentField.findUnique({
        where: { id: fieldId },
      });

      if (!field) {
        this.logger.warn(`Component field with ID ${fieldId} not found`);
        throw new Error(`Component field with ID ${fieldId} not found`);
      }

      await this.prisma.componentField.delete({
        where: { id: fieldId },
      });

      const updatedComponent = await this.getComponentById(field.componentId);
      const components = await this.getAllComponents();

      return {
        message: 'Component field deleted successfully',
        component: updatedComponent,
        components,
      };
    } catch (error) {
      this.logger.error('Error deleting component field', error);
      throw error;
    }
  }
}
