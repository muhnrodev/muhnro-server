import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './team-member.dto';

@Controller('team-members')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @Get()
  async getAllTeamMembers() {
    return this.teamMemberService.getTeamMembers();
  }

  @Post()
  async createTeamMember(@Body() data: CreateTeamMemberDto) {
    return this.teamMemberService.createTeamMember(data);
  }

  @Put()
  async updateTeamMember(@Body() data: UpdateTeamMemberDto) {
    return this.teamMemberService.updateTeamMember(data);
  }

  @Delete(':teamMemberId')
  async deleteTeamMember(@Body('teamMemberId') teamMemberId: string) {
    return this.teamMemberService.deleteTeamMember(teamMemberId);
  }
}
