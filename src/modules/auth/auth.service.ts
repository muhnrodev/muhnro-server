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
import { AuthJwtPayload } from './types/auth-jwtPayload.js';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import * as config from '@nestjs/config';
import { AuthEventType } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';

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

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const userCredential = await this.userService.getUserCredentials(user.id);

      if (!userCredential)
        throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await compare(
        password,
        userCredential.passwordHash,
      );

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');

      return { id: user.id, email: user.email, username: user.username };
    } catch (error) {
      this.logger.error('Failed to validate user', error.stack);
      throw error;
    }
  }

  login(userId: string) {
    try {
      const user = this.userService.getUserById(userId);
      const payload: AuthJwtPayload = { sub: userId };
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
    } catch (error) {}
  }

  refreshToken(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
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
    request: any,
  ) {
    try {
      const ipAddress =
        request.ip || request.socket?.remoteAddress || 'Unknown';
      const userAgent = request.headers['user-agent'] || 'Unknown';
      const metadata = request.headers;

      await this.prisma.authEvent.create({
        data: {
          userId,
          eventType: eventType,
          ipAddress,
          occurredAt: new Date(),
          userAgent,
          metadata,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create auth event', error.stack);
      throw error;
    }
  }
}
