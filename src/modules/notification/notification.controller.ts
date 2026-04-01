import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { PromotionalPreferenceDto } from './dto/promotional.dto.js';
import { NotificationService } from './notification.service.js';
import { InsightPreferenceDto } from './dto/insight.dto.js';
import { NotificationsDto } from './dto/notifications.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  async updateNotificationPreferences(
    @Request() req,
    @Body() data: NotificationsDto,
  ) {
    const userId = req.user.id;

    return this.service.updateNotificationPreferences(userId, data);
  }

  @Post('promotional')
  async updatePromotionalPreferences(
    @Request() req,
    @Body() data: PromotionalPreferenceDto,
  ) {
    const userId = req.user.id;

    return this.service.updatePromotionalPreferences(userId, data);
  }

  @Post('insights')
  async updateInsightsPreferences(
    @Request() req,
    @Body() data: InsightPreferenceDto,
  ) {
    const userId = req.user.id;

    return this.service.updateInsightsPreferences(userId, data);
  }
}
