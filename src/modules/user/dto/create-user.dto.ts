import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums.js';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
