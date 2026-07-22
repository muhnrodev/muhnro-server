import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ObjectService } from '../object/object.service.js';
import { WebpageService } from '../webpage/webpage.service.js';
import { WebsiteService } from '../website/website.service.js';
import { ComponentService } from '../component/component.service.js';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly webpageService: WebpageService,
    private readonly websiteService: WebsiteService,
    private readonly objectService: ObjectService,
    private readonly componentService: ComponentService,
  ) {}

  async getAllData() {
    try {
      const [webpages, websites, objects, components] = await Promise.all([
        this.webpageService.getAllWebpages(),
        this.websiteService.getAllWebsites(),
        this.objectService.getAllObjects(),
        this.componentService.getAllComponents(),
      ]);
      return { webpages, websites, objects, components };
    } catch (error) {
      this.logger.error('Error fetching data', error);
      throw error;
    }
  }
}
