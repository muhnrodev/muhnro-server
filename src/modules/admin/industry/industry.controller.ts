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
import { IndustryService } from './industry.service.js';
import { CreateIndustryDto, UpdateIndustryDto } from './industry.dto.js';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard.js';

@Controller('industry')
@UseGuards(JwtAuthGuard)
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Get()
  async getAllIndustries() {
    return this.industryService.getAllIndustries();
  }

  @Get('id/:industryId')
  async getIndustryById(@Param('industryId') industryId: string) {
    return this.industryService.getIndustryById(industryId);
  }

  @Post()
  async createIndustry(@Body() data: CreateIndustryDto, @Request() req) {
    const user = req.user.id;
    return this.industryService.createIndustry(data, user);
  }

  @Put()
  async updateIndustry(@Body() data: UpdateIndustryDto, @Request() req) {
    const user = req.user.id;
    return this.industryService.updateIndustry(data, user);
  }

  @Delete(':industryId')
  async deleteIndustry(@Param('industryId') industryId: string) {
    return this.industryService.deleteIndustry(industryId);
  }
}
