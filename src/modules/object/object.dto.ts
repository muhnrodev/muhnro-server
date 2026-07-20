import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FieldType } from '../../generated/prisma/enums.js';

export class CreateObjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class UpdateObjectDto extends CreateObjectDto {
  @IsString()
  id: string;

  @IsString()
  key: string;
}

export class CreateObjectFieldDto {
  @IsString()
  objectSchemaId: string;

  @IsString()
  label: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsString()
  @IsOptional()
  objectSchemaRefId?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsEnum(FieldType)
  @IsOptional()
  arrayType?: FieldType;

  @IsNumber()
  @IsOptional()
  minLength?: number;

  @IsNumber()
  @IsOptional()
  maxLength?: number;

  @IsNumber()
  @IsOptional()
  minValue?: number;

  @IsNumber()
  @IsOptional()
  maxValue?: number;

  @IsString()
  @IsOptional()
  regex?: string;
}

export class UpdateObjectFieldDto extends CreateObjectFieldDto {
  @IsString()
  id: string;

  @IsString()
  key: string;
}
