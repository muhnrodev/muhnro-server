import { Module } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { TagModule } from './tag/tag.module.js';
import { IndustryModule } from './industry/industry.module.js';
import { ClientModule } from './client/client.module';
import { StakeholdersModule } from './stakeholder/stakeholder.module.js';
import { LocationModule } from './location/location.module';
import { TeamMemberModule } from './team-member/team-member.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [TagModule, IndustryModule, ClientModule, StakeholdersModule, LocationModule, TeamMemberModule],
})
export class AdminModule {}
