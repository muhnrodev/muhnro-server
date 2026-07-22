import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WebpageService } from './webpage.service.js';
import {
  CreateWebpageComponentDto,
  CreateWebpageDto,
  UpdateWebpageDto,
} from './webpage.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('webpage')
@UseGuards(JwtAuthGuard)
export class WebpageController {
  constructor(private readonly webpageService: WebpageService) {}

  @Get()
  async getAllWebpages() {
    return this.webpageService.getAllWebpages();
  }

  @Get('id/:id')
  async getWebpageById(@Param('id') id: string) {
    return this.webpageService.getWebpageById(id);
  }

  @Post()
  async createWebpage(@Body() data: CreateWebpageDto, @Request() req) {
    const createdBy = req.user.id;
    return this.webpageService.createWebpage(data, createdBy);
  }

  @Put()
  async updateWebpage(@Body() data: UpdateWebpageDto, @Request() req) {
    const updatedBy = req.user.id;
    return this.webpageService.updateWebpage(data, updatedBy);
  }

  @Delete(':id')
  async deleteWebpage(@Param('id') id: string) {
    return this.webpageService.deleteWebpage(id);
  }

  @Post('component')
  async createWebpageComponent(@Body() data: CreateWebpageComponentDto) {
    return this.webpageService.createWebpageComponent(data);
  }
}
