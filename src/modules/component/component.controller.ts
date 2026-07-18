import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ComponentService } from './component.service.js';
import { CreateComponentDto } from './component.dto.js';
import { Roles } from '../auth/decorator/role.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('component')
@UseGuards(JwtAuthGuard)
@Roles('EDITOR', 'ADMIN')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Get()
  getAllComponents() {
    return this.componentService.getAllComponents();
  }

  @Get('/id/:id')
  async getComponentById(@Param('id') id: string) {
    return this.componentService.getComponentById(id);
  }

  @Get('/key/:key')
  async getComponentByKey(@Param('key') key: string) {
    return this.componentService.getComponentByKey(key);
  }

  @Post()
  async createComponent(@Request() req, @Body() data: CreateComponentDto) {
    return this.componentService.createComponent(data, req.user.id);
  }
}
