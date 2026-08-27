import { Global, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import slugify from 'slugify';

@Global()
@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    try {
      const cleanFirst = firstName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const cleanLast = lastName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      let attempt = 1;
      let username = '';

      while (true) {
        const prefix = cleanFirst.substring(0, attempt);
        username = `${prefix}${cleanLast}`;

        const existingUser = await this.prisma.user.findUnique({
          where: { username },
        });

        if (!existingUser) {
          return username;
        }

        attempt++;

        if (attempt > cleanFirst.length) {
          const randomNumber = Math.floor(1000 + Math.random() * 9000);
          username = `${cleanFirst[0]}${cleanLast}${randomNumber}`;
          return username;
        }
      }
    } catch (error) {
      this.logger.error('Failed to generate username', error);
      throw error;
    }
  }

  async generateComponentKey(name: string): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await this.prisma.component.findUnique({
      where: { key: slug },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }

  async generateComponentFieldKey(
    name: string,
    componentId: string,
  ): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await this.prisma.componentField.findUnique({
      where: {
        componentId_key: {
          componentId,
          key: slug,
        },
      },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }

  async generateObjectFieldKey(
    name: string,
    objectSchemaId: string,
  ): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await this.prisma.objectSchemaField.findUnique({
      where: {
        objectSchemaId_key: {
          objectSchemaId,
          key: slug,
        },
      },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }

  async generateObjectSchemaKey(name: string): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await this.prisma.objectSchema.findUnique({
      where: { key: slug },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }

  async generatePageComponentKey(
    webpageId: string,
    componentId: string,
  ): Promise<string> {
    const webpage = await this.prisma.webpage.findUnique({
      where: { id: webpageId },
    });

    if (!webpage) {
      throw new Error(`Webpage with ID ${webpageId} not found`);
    }

    const component = await this.prisma.component.findUnique({
      where: { id: componentId },
    });

    if (!component) {
      throw new Error(`Component with ID ${componentId} not found`);
    }

    const slug = slugify(`${webpage.name}-${component.key}`, {
      lower: true,
      strict: true,
    });

    const exists = await this.prisma.pageComponent.findUnique({
      where: { key: slug },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }

  async generateArticleSlug(title: string): Promise<string> {
    const slug = slugify(title, { lower: true, strict: true });

    const exists = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${slug}-${randomSuffix}`;
    }

    return slug;
  }
}
