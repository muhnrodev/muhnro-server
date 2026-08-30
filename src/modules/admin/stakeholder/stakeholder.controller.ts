import { Controller } from '@nestjs/common';
import { StakeholdersService } from './stakeholder.service';

@Controller('stakeholders')
export class StakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}
}
