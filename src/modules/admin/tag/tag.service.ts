import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateTagDto, UpdateTagDto } from './tag.dto.js';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllTags() {
    try {
      const tags = await this.prisma.tag.findMany();
      return tags;
    } catch (error) {
      this.logger.error('Error fetching tags', error);
      throw error;
    }
  }

  async getTagById(tagId: string) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { tagId },
      });

      if (!tag) {
        this.logger.warn(`Tag with ID "${tagId}" not found`);
        throw new NotFoundException('Tag not found');
      }

      return tag;
    } catch (error) {
      this.logger.error('Error fetching tag by ID', error);
      throw error;
    }
  }

  async createTag(data: CreateTagDto, user: string) {
    try {
      const existingTag = await this.prisma.tag.findUnique({
        where: { name: data.name },
      });

      if (existingTag) {
        this.logger.warn(`Tag with name "${data.name}" already exists`);
        throw new ConflictException('Tag with this name already exists');
      }

      const tag = await this.prisma.tag.create({
        data: {
          name: data.name,
          description: data.description,
          updatedBy: user,
        },
      });

      return {
        message: 'Tag created successfully',
        tag,
        tags: await this.getAllTags(),
      };
    } catch (error) {
      this.logger.error('Error creating tag', error);
      throw error;
    }
  }

  async updateTag(data: UpdateTagDto, user: string) {
    try {
      const existingTag = await this.prisma.tag.findUnique({
        where: { tagId: data.tagId },
      });

      if (!existingTag) {
        this.logger.warn(`Tag with ID "${data.tagId}" not found`);
        throw new NotFoundException('Tag not found');
      }

      const updatedTag = await this.prisma.tag.update({
        where: { tagId: data.tagId },
        data: {
          name: data.name,
          description: data.description,
          updatedBy: user,
        },
      });
      return {
        message: 'Tag updated successfully',
        tag: updatedTag,
        tags: await this.getAllTags(),
      };
    } catch (error) {
      this.logger.error('Error updating tag', error);
      throw error;
    }
  }

  async deleteTag(tagId: string) {
    try {
      const existingTag = await this.prisma.tag.findUnique({
        where: { tagId },
      });

      if (!existingTag) {
        this.logger.warn(`Tag with ID "${tagId}" not found`);
        throw new NotFoundException('Tag not found');
      }

      await this.prisma.tag.delete({
        where: { tagId },
      });

      return {
        message: 'Tag deleted successfully',
        tags: await this.getAllTags(),
      };
    } catch (error) {
      this.logger.error('Error deleting tag', error);
      throw error;
    }
  }
}
