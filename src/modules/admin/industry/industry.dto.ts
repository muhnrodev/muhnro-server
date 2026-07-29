import { IsString } from 'class-validator';

export class CreateIndustryDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  description: string;
}

export class UpdateIndustryDto extends CreateIndustryDto {
  @IsString()
  industryId: string;
}
