import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { NotificationPreferenceDto } from './dto/notification_preference.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications')
  async updateNotifications(
    @Request() req,
    @Body() notificationPreferenceDto: NotificationPreferenceDto,
  ) {
    return this.userService.updateNotificationPreferences(
      req.user.id,
      notificationPreferenceDto,
    );
  }
}
