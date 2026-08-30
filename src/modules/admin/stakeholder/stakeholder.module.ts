import { Module } from '@nestjs/common';
import { StakeholdersService } from './stakeholder.service';
import { StakeholdersController } from './stakeholder.controller';

@Module({
  controllers: [StakeholdersController],
  providers: [StakeholdersService],
  exports: [StakeholdersService],
})
export class StakeholdersModule {}
