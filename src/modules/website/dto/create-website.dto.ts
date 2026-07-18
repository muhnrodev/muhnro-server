import { IsString } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  domain: string;
}
