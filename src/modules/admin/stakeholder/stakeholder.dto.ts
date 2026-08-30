import { IsEnum, IsString } from 'class-validator';
import { StakeholderType } from 'src/generated/prisma/enums';

export class CreateStakeholderDto {
  @IsString()
  name: string;

  @IsString()
  organization: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsEnum(StakeholderType)
  type: StakeholderType;
}

export class UpdateStakeholderDto extends CreateStakeholderDto {
  @IsString()
  stakeholderId: string;
}
