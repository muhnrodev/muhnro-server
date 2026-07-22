import { Module } from '@nestjs/common';
import { WebpageService } from './webpage.service.js';
import { WebpageController } from './webpage.controller.js';
import { WebsiteService } from '../website/website.service.js';

@Module({
  controllers: [WebpageController],
  providers: [WebpageService, WebsiteService],
})
export class WebpageModule {}
