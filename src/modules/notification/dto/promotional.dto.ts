import { IsBoolean, IsString } from 'class-validator';

export class PromotionalPreferenceDto {
  @IsBoolean()
  monthlyNewsletter: boolean;

  @IsBoolean()
  vacanciesUpdates: boolean;

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
