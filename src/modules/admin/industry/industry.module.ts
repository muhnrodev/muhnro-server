import { Module } from '@nestjs/common';
import { IndustryService } from './industry.service.js';
import { IndustryController } from './industry.controller.js';

@Module({
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}
