import { IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTagDto extends CreateTagDto {
  @IsString()
  tagId: string;
}
