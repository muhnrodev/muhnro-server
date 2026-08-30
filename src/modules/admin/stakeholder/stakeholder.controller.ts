import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StakeholdersService } from './stakeholder.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateStakeholderDto, UpdateStakeholderDto } from './stakeholder.dto';

@Controller('stakeholders')
@UseGuards(JwtAuthGuard)
export class StakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}

  @Get()
  async getAllStakeholders() {
    return this.stakeholdersService.getAllStakeholders();
  }

  @Post()
  async createStakeholder(@Body() data: CreateStakeholderDto) {
    return this.stakeholdersService.createStakeholder(data);
  }

  @Get(':id')
  async getStakeholderById(@Param('id') stakeholderId: string) {
    return this.stakeholdersService.getStakeholderById(stakeholderId);
  }

  @Put()
  async updateStakeholder(@Body() data: UpdateStakeholderDto) {
    return this.stakeholdersService.updateStakeholder(data);
  }

  @Delete(':id')
  async deleteStakeholder(@Param('id') stakeholderId: string) {
    return this.stakeholdersService.deleteStakeholder(stakeholderId);
  }
}
