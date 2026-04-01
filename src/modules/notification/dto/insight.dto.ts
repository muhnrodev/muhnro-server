import { IsBoolean } from 'class-validator';

export class InsightPreferenceDto {
  @IsBoolean()
  monthlyInsights: boolean;

  @IsBoolean()
  suggestedReports: boolean;

  @IsBoolean()
  suggestedArticles: boolean;

  @IsBoolean()
  followedAuthors: boolean;

  @IsBoolean()
  followedTags: boolean;

  @IsBoolean()
  followedIndustries: boolean;
}
