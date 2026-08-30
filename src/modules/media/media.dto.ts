import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MediaType } from 'src/generated/prisma/enums';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  folderPath: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsString()
  @IsOptional()
  caption?: string;
}
