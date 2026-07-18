import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service.js';
import refreshJwtConfig from '../config/refresh-jwt.config.js';
import type { ConfigType } from '@nestjs/config';
import { UserRole } from '../../../generated/prisma/browser.js';
import * as bcrypt from 'bcrypt';
import { EventService } from './event.service.js';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly eventService: EventService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async getSessionById(sessionId: string) {
    try {
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        this.logger.warn(`Session with ID ${sessionId} not found`);
        throw new UnauthorizedException('Invalid session');
      }

      return session;
    } catch (error) {
      this.logger.error(`Error retrieving session with ID ${sessionId}`, error);
      throw error;
    }
  }

  async createLoginSession(userId: string, role: UserRole) {
    try {
      const session = await this.createSession(userId);

      const payload = { sub: userId, role, sessionId: session.id };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(
        payload,
        this.refreshTokenConfig,
      );

      await this.updateSessionToken(session.id, refreshToken);

      return { accessToken, refreshToken, session };
    } catch (error) {
      this.logger.error(
        `Error creating login session for user ${userId}`,
        error,
      );
      throw error;
    }
  }

  async validateSession(userId: string, refreshToken: string) {
    try {
      const sessions = await this.prisma.session.findMany({
        where: { userId },
      });

      for (const session of sessions) {
        const isValid = await bcrypt.compare(refreshToken, session.tokenHash);

        if (isValid && session.expiresAt > new Date()) {
          return session;
        }
      }

      this.logger.warn(`No valid session found for user ${userId}`);
      throw new UnauthorizedException('Invalid session');
    } catch (error) {}
  }

  async revokeSession(sessionId: string) {
    try {
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
    } catch (error) {
      this.logger.error(`Error revoking session with ID ${sessionId}`, error);
      throw error;
    }
  }

  async revokeAllUserSessions(userId: string) {
    try {
      return this.prisma.session.deleteMany({
        where: { userId },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to revoke all sessions for userId: ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async createSession(userId: string) {
    try {
      return this.prisma.session.create({
        data: {
          userId,
          tokenHash: '',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to create session for userId: ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateSessionToken(sessionId: string, refreshToken: string) {
    try {
      const tokenHash = await bcrypt.hash(refreshToken, 10);
      return this.prisma.session.update({
        where: { id: sessionId },
        data: { tokenHash },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to update session token for sessionId: ${sessionId}`,
        error.stack,
      );
      throw error;
    }
  }
}
