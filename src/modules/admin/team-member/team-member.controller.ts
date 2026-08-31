import { Controller } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';

@Controller('team-member')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}
}
