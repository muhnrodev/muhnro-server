import { IsBoolean } from 'class-validator';

export class NotificationsDto {
  @IsBoolean()
  pushNotifications: boolean;

  @IsBoolean()
  emailNotifications: boolean;

  @IsBoolean()
  smsNotifications: boolean;
}
