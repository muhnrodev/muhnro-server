import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { StakeholdersModule } from '../stakeholder/stakeholder.module';

@Module({
  imports: [StakeholdersModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
