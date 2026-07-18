import { Injectable, Logger } from '@nestjs/common';
import { AuthEventType } from '../../../generated/prisma/enums.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAuthEvent(
    userId: string,
    eventType: AuthEventType,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ) {
    try {
      await this.prisma.authEvent.create({
        data: {
          userId,
          eventType: eventType,
          ipAddress: ipAddress || 'Unknown',
          occurredAt: new Date(),
          userAgent: userAgent || 'Unknown',
          metadata,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create auth event');
      throw error;
    }
  }
}
