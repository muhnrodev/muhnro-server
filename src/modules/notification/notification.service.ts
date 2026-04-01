import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PromotionalPreferenceDto } from './dto/promotional.dto.js';
import { UserService } from '../user/user.service.js';
import { InsightPreferenceDto } from './dto/insight.dto.js';
import { NotificationsDto } from './dto/notifications.dto.js';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async updateNotificationPreferences(userId: string, data: NotificationsDto) {
    try {
      await this.prisma.notificationPreference.upsert({
        where: { userId },
        update: {
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
          smsNotifications: data.smsNotifications,
        },
        create: {
          userId,
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
          smsNotifications: data.smsNotifications,
        },
      });

      const user = await this.userService.getUserById(userId);

      return {
        message: 'Notification preferences updated successfully',
        user: user,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update notification preferences for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async updatePromotionalPreferences(
    userId: string,
    data: PromotionalPreferenceDto,
  ) {
    try {
      await this.prisma.promotionalPreference.upsert({
        where: { userId },
        update: {
          monthlyNewsletter: data.monthlyNewsletter,
          vacanciesUpdates: data.vacanciesUpdates,
          productAnnouncements: data.productAnnouncements,
          specialOffers: data.specialOffers,
          eventInvitations: data.eventInvitations,
          projectUpdates: data.projectUpdates,
          subscriptionReminders: data.subscriptionReminders,
        },
        create: {
          userId,
          monthlyNewsletter: data.monthlyNewsletter,
          vacanciesUpdates: data.vacanciesUpdates,
          productAnnouncements: data.productAnnouncements,
          specialOffers: data.specialOffers,
          eventInvitations: data.eventInvitations,
          projectUpdates: data.projectUpdates,
          subscriptionReminders: data.subscriptionReminders,
        },
      });

      const user = await this.userService.getUserById(userId);
      return {
        message: 'Promotional preferences updated successfully',
        user: user,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update promotional preferences for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateInsightsPreferences(userId: string, data: InsightPreferenceDto) {
    try {
      await this.prisma.insightsPreference.upsert({
        where: { userId },
        update: {
          monthlyInsights: data.monthlyInsights,
          suggestedReports: data.suggestedReports,
          suggestedArticles: data.suggestedArticles,
          followedAuthors: data.followedAuthors,
          followedIndustries: data.followedIndustries,
          followedTags: data.followedTags,
        },
        create: {
          userId,
          monthlyInsights: data.monthlyInsights,
          suggestedReports: data.suggestedReports,
          suggestedArticles: data.suggestedArticles,
          followedAuthors: data.followedAuthors,
          followedIndustries: data.followedIndustries,
          followedTags: data.followedTags,
        },
      });

      const user = await this.userService.getUserById(userId);

      return {
        message: 'Insights preferences updated successfully',
        user: user,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update insights preferences for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
