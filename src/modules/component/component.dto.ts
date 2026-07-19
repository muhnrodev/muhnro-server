import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FieldType } from '../../generated/prisma/enums.js';
import { PartialType } from '@nestjs/mapped-types';

export class CreateComponentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class UpdateComponentDto extends CreateComponentDto {
  @IsString()
  id: string;

  @IsString()
  key: string;
}

export class CreateComponentFieldDto {
  @IsString()
  componentId: string;

  @IsString()
  label: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsBoolean()
  required: boolean;

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

  @IsArray()
  @IsOptional()
  itemSchema?: ItemSchemaDto[];
}

export class UpdateComponentFieldDto extends CreateComponentFieldDto {
  @IsString()
  id: string;

  @IsString()
  key: string;
}

export class ItemSchemaDto {
  @IsString()
  label: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsBoolean()
  required: boolean;
}
