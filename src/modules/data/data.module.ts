import { Module } from '@nestjs/common';
import { DataService } from './data.service.js';
import { DataController } from './data.controller.js';
import { WebpageService } from '../webpage/webpage.service.js';
import { WebsiteService } from '../website/website.service.js';
import { ObjectService } from '../object/object.service.js';
import { ComponentService } from '../component/component.service.js';

@Module({
  controllers: [DataController],
  providers: [
    DataService,
    WebpageService,
    WebsiteService,
    ObjectService,
    ComponentService,
  ],
})
export class DataModule {}
