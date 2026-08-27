import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { ArticleService } from './article.service.js';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard.js';
import { CreateArticleDto } from './article.dto.js';

@Controller('article')
@UseGuards(JwtAuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getAllArticles(@Request() req) {
    const { role, id } = req.user;

    if (role === 'ADMIN') {
      return this.articleService.getAllArticles();
    } else {
      return this.articleService.getUserArticles(id);
    }
  }

  @Get(':id')
  async getArticleById(@Request() req) {
    const { id } = req.params;
    return this.articleService.getArticleById(id);
  }

  @Get('slug/:slug')
  async getArticleBySlug(@Request() req) {
    const { slug } = req.params;
    return this.articleService.getArticleBySlug(slug);
  }

  @Post()
  async createArticle(@Body() data: CreateArticleDto, @Request() req) {
    const { id } = req.user;
    return this.articleService.createArticle(data, id);
  }
}
