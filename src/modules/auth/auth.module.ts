import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config.js';
import { GoogleStrategy } from './strategies/google.strategy.js';
import { UserModule } from '../user/user.module.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import { RefreshJwtStrategy } from './strategies/refresh.strategy.js';
import { EventService } from './services/event.service.js';
import { SessionService } from './services/session.service.js';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EventService,
    SessionService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
