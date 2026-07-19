import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { ComponentService } from './component.service.js';
import {
  CreateComponentDto,
  CreateComponentFieldDto,
  UpdateComponentDto,
  UpdateComponentFieldDto,
} from './component.dto.js';
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

  @Put()
  async updateComponent(@Body() data: UpdateComponentDto) {
    return this.componentService.updateComponent(data);
  }

  @Delete('/:id')
  async deleteComponent(@Param('id') id: string) {
    return this.componentService.deleteComponent(id);
  }

  @Post('/field')
  async createComponentField(@Body() data: CreateComponentFieldDto) {
    return this.componentService.createComponentField(data);
  }

  @Put('/field')
  async updateComponentField(@Body() data: UpdateComponentFieldDto) {
    return this.componentService.updateComponentField(data);
  }

  @Delete('/field/:id')
  async deleteComponentField(@Param('id') id: string) {
    return this.componentService.deleteComponentField(id);
  }
}
