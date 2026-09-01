import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './team-member.dto';

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

  async getTeamMemberById(teamMemberId: string) {
    try {
      const teamMember = await this.prisma.teamMember.findUnique({
        where: { teamMemberId, isDeleted: false },
      });
      return teamMember;
    } catch (error) {
      this.logger.error(
        `Error fetching team member with ID ${teamMemberId}`,
        error,
      );
      throw error;
    }
  }

  async createTeamMember(data: CreateTeamMemberDto) {
    try {
      const teamMember = await this.prisma.teamMember.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          employmentType: data.employmentType,
          isDeleted: false,
        },
      });

      return {
        message: 'Team member created successfully',
        teamMember,
        teamMembers: await this.getTeamMembers(),
      };
    } catch (error) {
      this.logger.error('Error creating team member', error);
      throw error;
    }
  }

  async updateTeamMember(data: UpdateTeamMemberDto) {
    try {
      const existingTeamMember = await this.getTeamMemberById(
        data.teamMemberId,
      );

      if (!existingTeamMember) {
        this.logger.error(`Team member with ID ${data.teamMemberId} not found`);
        throw new NotFoundException(`Team member not found`);
      }

      const updatedTeamMember = await this.prisma.teamMember.update({
        where: { teamMemberId: data.teamMemberId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          employmentType: data.employmentType,
        },
      });

      return {
        message: 'Team member updated successfully',
        teamMember: updatedTeamMember,
        teamMembers: await this.getTeamMembers(),
      };
    } catch (error) {
      this.logger.error('Error updating team member', error);
      throw error;
    }
  }

  async deleteTeamMember(teamMemberId: string) {
    try {
      const existingTeamMember = await this.getTeamMemberById(teamMemberId);

      if (!existingTeamMember) {
        this.logger.error(`Team member with ID ${teamMemberId} not found`);
        throw new NotFoundException(`Team member not found`);
      }

      await this.prisma.teamMember.update({
        where: { teamMemberId },
        data: { isDeleted: true, deletedAt: new Date() },
      });

      return {
        message: 'Team member deleted successfully',
        teamMembers: await this.getTeamMembers(),
      };
    } catch (error) {
      this.logger.error('Error deleting team member', error);
      throw error;
    }
  }
}
