import { Module } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { ArticleModule } from './article/article.module.js';

@Module({
  providers: [ContentService],
  imports: [ArticleModule],
})
export class ContentModule {}
