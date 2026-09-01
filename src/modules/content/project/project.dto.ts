import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  code: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsString()
  story: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  clientId: string;

  @IsString()
  projectLeadId: string;

  @IsString()
  industryId: string;

  @IsString()
  locationId: string;

  @IsString()
  featuredImageId: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  serviceSummary: string;
}

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  id: string;
}
