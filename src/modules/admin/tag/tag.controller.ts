import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service.js';
import { CreateTagDto, UpdateTagDto } from './tag.dto.js';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard.js';

@Controller('tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAllTags() {
    return this.tagService.getAllTags();
  }

  @Get('id/:tagId')
  async getTagById(@Param('tagId') tagId: string) {
    return this.tagService.getTagById(tagId);
  }

  @Post()
  async createTag(@Body() data: CreateTagDto, @Request() req) {
    const user = req.user.id;
    return this.tagService.createTag(data, user);
  }

  @Put()
  async updateTag(@Body() data: UpdateTagDto, @Request() req) {
    const user = req.user.id;
    return this.tagService.updateTag(data, user);
  }

  @Delete(':tagId')
  async deleteTag(@Param('tagId') tagId: string) {
    return this.tagService.deleteTag(tagId);
  }
}
