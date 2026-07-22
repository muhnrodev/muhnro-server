import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateWebpageDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  websiteId: string;
}

export class UpdateWebpageDto extends CreateWebpageDto {
  @IsString()
  id: string;
}

export class WebPageComponentValueDto {
  @IsString()
  fieldId: string;

  @IsString()
  value: string;
}

export class CreateWebpageComponentDto {
  @IsString()
  webpageId: string;

  @IsString()
  componentId: string;

  @IsArray()
  @IsNotEmpty()
  fields: WebPageComponentValueDto[];
}
