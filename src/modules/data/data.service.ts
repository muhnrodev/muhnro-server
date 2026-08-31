import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ObjectService } from '../object/object.service.js';
import { WebpageService } from '../webpage/webpage.service.js';
import { WebsiteService } from '../website/website.service.js';
import { ComponentService } from '../component/component.service.js';
import { IndustryService } from '../admin/industry/industry.service.js';
import { TagService } from '../admin/tag/tag.service.js';
import { ClientService } from '../admin/client/client.service.js';
import { StakeholdersService } from '../admin/stakeholder/stakeholder.service.js';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly webpageService: WebpageService,
    private readonly websiteService: WebsiteService,
    private readonly objectService: ObjectService,
    private readonly componentService: ComponentService,
    private readonly industryService: IndustryService,
    private readonly tagService: TagService,
    private readonly clientService: ClientService,
    private readonly stakeholderService: StakeholdersService,
  ) {}

  async getAllData() {
    try {
      const [
        webpages,
        websites,
        objects,
        components,
        industries,
        tags,
        clients,
        stakeholders,
      ] = await Promise.all([
        this.webpageService.getAllWebpages(),
        this.websiteService.getAllWebsites(),
        this.objectService.getAllObjects(),
        this.componentService.getAllComponents(),
        this.industryService.getAllIndustries(),
        this.tagService.getAllTags(),
        this.clientService.getAllClients(),
        this.stakeholderService.getAllStakeholders(),
      ]);
      return {
        webpages,
        websites,
        objects,
        components,
        industries,
        tags,
        clients,
        stakeholders,
      };
    } catch (error) {
      this.logger.error('Error fetching data', error);
      throw error;
    }
  }
}
