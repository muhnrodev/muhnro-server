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
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('EDITOR', 'ADMIN')
  async getAllWebsites() {
    return this.websiteService.getAllWebsites();
  }

  @Get('/id/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('EDITOR', 'ADMIN')
  async getWebsiteById(@Param('id') id: string) {
    return this.websiteService.getWebsiteById(id);
  }

  @Get('/content/:id')
  async getWebsiteContentById(@Param('id') id: string) {
    return this.websiteService.getWebsiteContentById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('EDITOR', 'ADMIN')
  async createWebsite(@Request() req, @Body() data: CreateWebsiteDto) {
    return this.websiteService.createWebsite(data, req.user.id);
  }
}
