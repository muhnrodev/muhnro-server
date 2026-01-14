import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IdentityProviderCode } from '../../../generated/prisma/client.js';

export class SocialLoginDto {
  @IsEnum(IdentityProviderCode)
  provider: IdentityProviderCode;

  @IsString()
  idToken: string;
}
