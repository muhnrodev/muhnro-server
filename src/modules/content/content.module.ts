import { Module } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { ArticleModule } from './article/article.module.js';
import { ProjectModule } from './project/project.module';

@Module({
  providers: [ContentService],
  imports: [ArticleModule, ProjectModule],
})
export class ContentModule {}
