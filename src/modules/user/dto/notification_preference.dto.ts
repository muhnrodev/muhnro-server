import { IsBoolean, IsString } from 'class-validator';

export class NotificationPreferenceDto {
  @IsString()
  id: string;

  @IsBoolean()
  pushNotifications: boolean;

  @IsBoolean()
  monthlyNewsletter: boolean;

  @IsBoolean()
  vacancies: boolean;

  @IsBoolean()
  dataInsights: boolean;

  @IsBoolean()
  productAnnouncements: boolean;

  @IsBoolean()
  specialOffers: boolean;

  @IsBoolean()
  eventInvitations: boolean;

  @IsBoolean()
  projectUpdates: boolean;

  @IsBoolean()
  subscriptionReminders: boolean;
}
