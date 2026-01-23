import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard.js';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result = this.authService.login(req.user.id);
    if (!result) {
      throw new Error('Login failed');
    }
    const { id, token, refreshToken } = result;

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access_token', token, {
      domain: isProd ? '.muhnro.com' : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      domain: isProd ? '.muhnro.com' : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    return { id, token, refreshToken, success: true };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback() {}
}
