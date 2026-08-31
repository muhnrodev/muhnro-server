import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamMemberService {
  private readonly logger = new Logger(TeamMemberService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTeamMembers() {
    try {
      const teamMembers = await this.prisma.teamMember.findMany({
        where: { isDeleted: false },
      });
      return teamMembers;
    } catch (error) {
      this.logger.error('Error fetching team members', error);
      throw error;
    }
  }
}
