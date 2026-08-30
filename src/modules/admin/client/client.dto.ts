import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateClientContactDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  clientId: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  isPrimary?: boolean;
}

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  industryId: string;

  @IsString()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  country: string;
}

export class UpdateClientDto extends CreateClientDto {
  @IsString()
  id: string;
}
