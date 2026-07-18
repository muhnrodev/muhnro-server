import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  Request as NestRequest,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { UserService } from '../user/user.service.js';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import * as config from '@nestjs/config';
import { AuthEventType, UserRole } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthJwtPayload } from './types/auth-jwtPayload.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: config.ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(
    email: string,
    password: string,
    role: UserRole,
    ip?: string,
    userAgent?: string,
  ) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        this.logger.warn(`User not found for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (user.role !== role) {
        this.logger.warn(
          `User role mismatch for email: ${email}. Expected: ${role}, Found: ${user.role}`,
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      const userCredential = await this.userService.getUserCredentials(user.id);

      if (!userCredential) {
        this.logger.warn(`User credentials not found for userId: ${user.id}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await compare(
        password,
        userCredential.passwordHash,
      );

      if (!isPasswordValid) {
        await this.createAuthEvent(
          user.id,
          AuthEventType.LOGIN_FAILED,
          ip,
          userAgent,
        );

        this.logger.warn(`Invalid password for userId: ${user.id}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
      };
    } catch (error) {
      this.logger.error('Failed to validate user', error);
      throw error;
    }
  }

  async login(userId: string) {
    try {
      const user = await this.userService.getUserById(userId);

      if (!user) throw new UnauthorizedException('User not found');

      const payload: AuthJwtPayload = { sub: userId, role: user.role };
      const token = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(
        payload,
        this.refreshTokenConfig,
      );

      return {
        id: userId,
        token,
        refreshToken,
        user,
      };
    } catch (error) {
      this.logger.error('Failed to login user', error);
      throw error;
    }
  }

  refreshToken(userId: string, role: UserRole) {
    const payload: AuthJwtPayload = { sub: userId, role };
    const token = this.jwtService.sign(payload);

    return {
      id: userId,
      token,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) {
      return user;
    }

    return this.userService.createUser(googleUser);
  }

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
