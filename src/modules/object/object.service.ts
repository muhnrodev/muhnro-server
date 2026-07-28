import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GeneratorService } from '../../common/generator/generator.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateObjectDto,
  CreateObjectFieldDto,
  UpdateObjectDto,
  UpdateObjectFieldDto,
} from './object.dto.js';

@Injectable()
export class ObjectService {
  private readonly logger = new Logger(ObjectService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly generator: GeneratorService,
  ) {}

  async getAllObjects() {
    try {
      const objects = await this.prisma.objectSchema.findMany({
        include: {
          fields: {
            include: {
              objectSchemaRef: {
                include: {
                  fields: true,
                },
              },
            },
          },
        },
      });
      return objects;
    } catch (error) {
      this.logger.error('Error fetching objects', error);
      throw error;
    }
  }

  async getObjectById(id: string) {
    try {
      const object = await this.prisma.objectSchema.findUnique({
        where: { id },
        include: {
          fields: {
            include: {
              objectSchemaRef: {
                include: {
                  fields: true,
                },
              },
            },
          },
        },
      });
      return object;
    } catch (error) {
      this.logger.error(`Error fetching object with ID ${id}`, error);
      throw error;
    }
  }

  async getObjectByKey(key: string) {
    try {
      const object = await this.prisma.objectSchema.findUnique({
        where: { key },
        include: {
          fields: {
            include: {
              objectSchemaRef: {
                include: {
                  fields: true,
                },
              },
            },
          },
        },
      });
      return object;
    } catch (error) {
      this.logger.error(`Error fetching object with key ${key}`, error);
      throw error;
    }
  }

  async createObject(data: CreateObjectDto) {
    try {
      const key = await this.generator.generateObjectSchemaKey(data.name);

      const newObject = await this.prisma.objectSchema.create({
        data: {
          name: data.name,
          description: data.description,
          key,
        },
      });

      return {
        message: 'Object created successfully',
        object: newObject,
        objects: await this.getAllObjects(),
      };
    } catch (error) {
      this.logger.error('Error creating object', error);
      throw error;
    }
  }

  async updateObject(data: UpdateObjectDto) {
    try {
      const updatedObject = await this.prisma.objectSchema.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
        },
      });

      return {
        message: 'Object updated successfully',
        object: updatedObject,
        objects: await this.getAllObjects(),
      };
    } catch (error) {
      this.logger.error(`Error updating object with ID ${data.id}`, error);
      throw error;
    }
  }

  async deleteObject(id: string) {
    try {
      await this.prisma.objectSchema.delete({
        where: { id },
      });

      return {
        message: 'Object deleted successfully',
        objects: await this.getAllObjects(),
      };
    } catch (error) {
      this.logger.error(`Error deleting object with ID ${id}`, error);
      throw error;
    }
  }

  async createObjectField(data: CreateObjectFieldDto) {
    try {
      const key = await this.generator.generateObjectFieldKey(
        data.label,
        data.objectSchemaId,
      );

      await this.prisma.objectSchemaField.create({
        data: {
          objectSchemaId: data.objectSchemaId,
          label: data.label,
          type: data.type,
          objectSchemaRefId: data.objectSchemaRefId,
          required: data.required,
          arrayType: data.arrayType,
          minLength: data.minLength,
          maxLength: data.maxLength,
          minValue: data.minValue,
          maxValue: data.maxValue,
          regex: data.regex,
          key,
        },
      });

      const object = await this.getObjectById(data.objectSchemaId);
      const objects = await this.getAllObjects();

      return {
        message: 'Object field created successfully',
        object,
        objects,
      };
    } catch (error) {
      this.logger.error('Error creating object field', error);
      throw error;
    }
  }

  async updateObjectField(data: UpdateObjectFieldDto) {
    try {
      const existingField = await this.prisma.objectSchemaField.findUnique({
        where: { id: data.id },
      });

      if (!existingField) {
        this.logger.error(`Object field with ID ${data.id} not found`);
        throw new NotFoundException(
          `Object field with ID ${data.id} not found`,
        );
      }

      await this.prisma.objectSchemaField.update({
        where: { id: data.id },
        data: {
          label: data.label,
          type: data.type,
          objectSchemaRefId: data.objectSchemaRefId,
          required: data.required,
          arrayType: data.arrayType,
          minLength: data.minLength,
          maxLength: data.maxLength,
          minValue: data.minValue,
          maxValue: data.maxValue,
          regex: data.regex,
        },
      });

      const object = await this.getObjectById(existingField.objectSchemaId);
      const objects = await this.getAllObjects();

      return {
        message: 'Object field updated successfully',
        object,
        objects,
      };
    } catch (error) {
      this.logger.error(
        `Error updating object field with ID ${data.id}`,
        error,
      );
      throw error;
    }
  }

  async deleteObjectField(id: string) {
    try {
      await this.prisma.objectSchemaField.delete({
        where: { id },
      });

      const objects = await this.getAllObjects();

      return {
        message: 'Object field deleted successfully',
        objects,
      };
    } catch (error) {
      this.logger.error(`Error deleting object field with ID ${id}`, error);
      throw error;
    }
  }
}
