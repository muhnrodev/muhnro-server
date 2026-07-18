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
import { EventService } from './services/event.service.js';
import { SessionService } from './services/session.service.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    private readonly eventService: EventService,
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

      // if (user.role !== role) {
      //   this.logger.warn(
      //     `User role mismatch for email: ${email}. Expected: ${role}, Found: ${user.role}`,
      //   );
      //   throw new UnauthorizedException('Invalid credentials');
      // }

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
        await this.eventService.createAuthEvent(
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

      if (!user) {
        this.logger.warn(`User not found for userId: ${userId}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const session = await this.sessionService.createLoginSession(
        userId,
        user.role,
      );

      return {
        id: userId,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user,
        role: user.role,
      };
    } catch (error) {
      this.logger.error('Failed to login user', error);
      throw error;
    }
  }

  async refreshToken(userId: string, role: UserRole, sessionId: string) {
    try {
      const isValidSession = await this.sessionService.validateSession(
        userId,
        sessionId,
      );

      if (!isValidSession) {
        this.logger.warn(
          `Invalid session for userId: ${userId}, sessionId: ${sessionId}`,
        );
        throw new UnauthorizedException('Invalid session');
      }

      const newAccessToken = this.jwtService.sign({
        sub: userId,
        role,
        sessionId,
      });

      await this.eventService.createAuthEvent(
        userId,
        AuthEventType.TOKEN_REFRESHED,
        undefined,
        undefined,
      );

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {}
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) {
      return user;
    }

    return this.userService.createUser(googleUser);
  }
}
