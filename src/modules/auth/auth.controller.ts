import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
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
  async login(@Request() req) {
    return this.authService.login(req.user.id);
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
