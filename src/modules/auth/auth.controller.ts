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
    const { id, accessToken, refreshToken, user } =
      await this.authService.login(req.user.id);

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
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

    return { id, accessToken, refreshToken, user, success: true };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const { id, role, sessionId } = req.user;
    return await this.authService.refreshToken(id, role, sessionId);
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
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
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
