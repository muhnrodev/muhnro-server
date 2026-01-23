import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GeneratorService } from '../../common/generator/generator.service.js';
import * as bcrypt from 'bcrypt';
import { NotificationPreferenceDto } from './dto/notification_preference.dto.js';
import { PrivacySettingsDto } from './dto/privacy_settings.dto.js';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly generator: GeneratorService,
  ) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        notification: true,
        privacy: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserCredentials(userId: string) {
    return this.prisma.userCredential.findUnique({
      where: { userId },
    });
  }

  async createUser(data: CreateUserDto) {
    try {
      const existingUser = await this.findByEmail(data.email);

      if (existingUser) {
        this.logger.warn(
          `Attempt to register with existing email: ${data.email}`,
        );
        throw new ConflictException('Email already in use');
      }

      const username = await this.generator.generateUsername(
        data.firstName,
        data.lastName,
      );

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          displayName: `${data.firstName} ${data.lastName}`,
          username,
        },
      });

      await this.createUserCredentials(user.id, data.password);

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }

  async updateNotificationPreferences(
    userId: string,
    data: NotificationPreferenceDto,
  ) {
    try {
      await this.prisma.notificationPreference.upsert({
        where: { userId },
        update: {
          pushNotifications: data.pushNotifications,
          monthlyNewsletter: data.monthlyNewsletter,
          vacancies: data.vacancies,
          dataInsights: data.dataInsights,
          productAnnouncements: data.productAnnouncements,
          specialOffers: data.specialOffers,
          eventInvitations: data.eventInvitations,
          projectUpdates: data.projectUpdates,
          subscriptionReminders: data.subscriptionReminders,
        },
        create: {
          id: data.id,
          userId,
          pushNotifications: data.pushNotifications,
          monthlyNewsletter: data.monthlyNewsletter,
          vacancies: data.vacancies,
          dataInsights: data.dataInsights,
          productAnnouncements: data.productAnnouncements,
          specialOffers: data.specialOffers,
          eventInvitations: data.eventInvitations,
          projectUpdates: data.projectUpdates,
          subscriptionReminders: data.subscriptionReminders,
        },
      });

      const user = await this.getUserById(userId);
      return {
        message: 'Notification preferences updated successfully',
        user: user,
      };
    } catch (error) {}
  }

  async updatePrivacySettings(userId: string, data: PrivacySettingsDto) {
    try {
      await this.prisma.privacySettings.upsert({
        where: { userId },
        update: {
          trackUserBehavior: data.trackUserBehavior,
          essentialCookies: data.essentialCookies,
          performanceCookies: data.performanceCookies,
          functionalCookies: data.functionalCookies,
          advertisingCookies: data.advertisingCookies,
          thirdPartyCookies: data.thirdPartyCookies,
          socialMediaCookies: data.socialMediaCookies,
          preferenceCookies: data.preferenceCookies,
        },
        create: {
          id: data.id,
          userId,
          trackUserBehavior: data.trackUserBehavior,
          essentialCookies: data.essentialCookies,
          performanceCookies: data.performanceCookies,
          functionalCookies: data.functionalCookies,
          advertisingCookies: data.advertisingCookies,
          thirdPartyCookies: data.thirdPartyCookies,
          socialMediaCookies: data.socialMediaCookies,
          preferenceCookies: data.preferenceCookies,
        },
      });

      const user = await this.getUserById(userId);
      return {
        message: 'Privacy Settings updated successfully',
        user: user,
      };
    } catch (error) {
      throw new Error('Failed to update privacy settings');
    }
  }

  async createUserCredentials(userId: string, password: string) {
    try {
      const hashedPassword = await this.hashPassword(password);
      await this.prisma.userCredential.create({
        data: {
          userId,
          passwordHash: hashedPassword,
          passwordAlgo: 'bcrypt',
        },
      });
    } catch (error) {
      throw new Error('Failed to create user credentials');
    }
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
