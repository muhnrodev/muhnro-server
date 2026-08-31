import { Module } from '@nestjs/common';
import { DataService } from './data.service.js';
import { DataController } from './data.controller.js';
import { WebpageService } from '../webpage/webpage.service.js';
import { WebsiteService } from '../website/website.service.js';
import { ObjectService } from '../object/object.service.js';
import { ComponentService } from '../component/component.service.js';
import { IndustryService } from '../admin/industry/industry.service.js';
import { TagService } from '../admin/tag/tag.service.js';
import { ClientService } from '../admin/client/client.service.js';
import { StakeholdersService } from '../admin/stakeholder/stakeholder.service.js';

@Module({
  controllers: [DataController],
  providers: [
    DataService,
    WebpageService,
    WebsiteService,
    ObjectService,
    ComponentService,
    IndustryService,
    TagService,
    ClientService,
    StakeholdersService,
  ],
})
export class DataModule {}
