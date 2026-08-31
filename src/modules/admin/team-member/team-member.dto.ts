import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmploymentType } from 'src/generated/prisma/enums';

export class CreateTeamMemberDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;
}

export class UpdateTeamMemberDto extends CreateTeamMemberDto {
  @IsString()
  teamMemberId: string;
}
