import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { WebsiteService } from './website.service.js';
import { Roles } from '../auth/decorator/role.decorator.js';
import { CreateWebsiteDto } from './dto/create-website.dto.js';

@Controller('website')
@UseGuards(JwtAuthGuard)
@Roles('EDITOR', 'ADMIN')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get()
  async getAllWebsites() {
    return this.websiteService.getAllWebsites();
  }

  @Get('/id/:id')
  async getWebsiteById(@Param('id') id: string) {
    return this.websiteService.getWebsiteById(id);
  }

  @Post()
  async createWebsite(@Request() req, @Body() data: CreateWebsiteDto) {
    return this.websiteService.createWebsite(data, req.user.id);
  }
}
