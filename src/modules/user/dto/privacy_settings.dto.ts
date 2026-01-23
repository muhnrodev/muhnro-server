import { IsBoolean, IsUUID } from 'class-validator';

export class PrivacySettingsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsBoolean()
  trackUserBehavior: boolean;

  @IsBoolean()
  essentialCookies: boolean;

  @IsBoolean()
  performanceCookies: boolean;

  @IsBoolean()
  functionalCookies: boolean;

  @IsBoolean()
  advertisingCookies: boolean;

  @IsBoolean()
  thirdPartyCookies: boolean;

  @IsBoolean()
  socialMediaCookies: boolean;

  @IsBoolean()
  preferenceCookies: boolean;
}
