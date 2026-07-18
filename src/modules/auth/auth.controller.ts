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
import { GoogleAuthGuard } from './guards/google-auth.guard.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { RefreshAuthGuard } from './guards/refresh-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(req.user.id);
    if (!result) {
      throw new Error('Login failed');
    }
    const { id, token, refreshToken, user } = result;

    // await this.authService.createAuthEvent(id, 'LOGIN', req);

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

    return { id, token, refreshToken, user, success: true };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const { id, role } = req.user;
    return this.authService.refreshToken(id, role);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(req.user.id);
    if (!result) {
      throw new Error('Login failed');
    }
    const { id, token, refreshToken, user } = result;

    // await this.authService.createAuthEvent(id, 'LOGIN', req);

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

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(frontendUrl);
  }
}
