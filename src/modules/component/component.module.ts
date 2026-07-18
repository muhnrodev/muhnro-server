import { Module } from '@nestjs/common';
import { ComponentService } from './component.service.js';
import { ComponentController } from './component.controller.js';

@Module({
  controllers: [ComponentController],
  providers: [ComponentService],
})
export class ComponentModule {}
