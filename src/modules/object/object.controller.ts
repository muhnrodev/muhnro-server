import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ObjectService } from './object.service.js';
import {
  CreateObjectDto,
  CreateObjectFieldDto,
  UpdateObjectDto,
  UpdateObjectFieldDto,
} from './object.dto.js';

@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Get()
  async getAllObjects() {
    return this.objectService.getAllObjects();
  }

  @Get('id/:id')
  async getObjectById(@Param('id') id: string) {
    return this.objectService.getObjectById(id);
  }

  @Get('key/:key')
  async getObjectByKey(@Param('key') key: string) {
    return this.objectService.getObjectByKey(key);
  }

  @Post()
  async createObject(@Body() data: CreateObjectDto) {
    return this.objectService.createObject(data);
  }

  @Put()
  async updateObject(@Body() data: UpdateObjectDto) {
    return this.objectService.updateObject(data);
  }

  @Delete(':id')
  async deleteObject(@Param('id') id: string) {
    return this.objectService.deleteObject(id);
  }

  @Post('field')
  async createObjectField(@Body() data: CreateObjectFieldDto) {
    return this.objectService.createObjectField(data);
  }

  @Put('field')
  async updateObjectField(@Body() data: UpdateObjectFieldDto) {
    return this.objectService.updateObjectField(data);
  }

  @Delete('field/:id')
  async deleteObjectField(@Param('id') id: string) {
    return this.objectService.deleteObjectField(id);
  }
}
