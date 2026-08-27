import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateArticleDto } from './article.dto.js';
import { GeneratorService } from '../../../common/generator/generator.service.js';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly generator: GeneratorService,
  ) {}

  async getAllArticles() {
    try {
      const articles = await this.prisma.article.findMany({});

      return articles;
    } catch (error) {
      this.logger.error('Error fetching articles', error);
      throw error;
    }
  }

  async getUserArticles(userId: string) {
    try {
      const articles = await this.prisma.article.findMany({
        where: {
          createdById: userId,
        },
      });
      return articles;
    } catch (error) {
      this.logger.error('Error fetching user articles', error);
      throw error;
    }
  }

  async getArticleById(articleId: string) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { articleId },
      });

      if (!article) {
        this.logger.warn(`Article with ID ${articleId} not found`);
        throw new NotFoundException('Article not found');
      }

      return article;
    } catch (error) {
      this.logger.error('Error fetching article by ID', error);
      throw error;
    }
  }

  async getArticleBySlug(slug: string) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { slug },
      });

      if (!article) {
        this.logger.warn(`Article with slug ${slug} not found`);
        throw new NotFoundException('Article not found');
      }

      return article;
    } catch (error) {
      this.logger.error('Error fetching article by slug', error);
      throw error;
    }
  }

  async createArticle(data: CreateArticleDto, user: string) {
    try {
      const slug = await this.generator.generateComponentKey(data.title);

      const article = await this.prisma.article.create({
        data: {
          slug,
          title: data.title,
          subtitle: data.subtitle,
          summary: data.summary,
          content: data.content,
          featuredImageId: data.featuredImageId,
          createdById: user,
          industryId: data.industryId,
          wordCount: data.wordCount,
          readingTime: data.readingTime,
        },
      });
    } catch (error) {
      this.logger.error('Error creating article', error);
      throw error;
    }
  }
}
