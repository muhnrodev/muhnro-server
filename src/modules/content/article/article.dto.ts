import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  summary?: string;

  @IsString()
  content: string;

  @IsString()
  featuredImageId: string;

  @IsNumber()
  wordCount: number;

  @IsNumber()
  readingTime: number;

  @IsString()
  industryId: string;
}
