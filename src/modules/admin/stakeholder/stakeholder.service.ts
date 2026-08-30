import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStakeholderDto } from './stakeholder.dto';

@Injectable()
export class StakeholdersService {
  private readonly logger = new Logger(StakeholdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createStakeholder(data: CreateStakeholderDto) {
    try {
      const stakeholder = await this.prisma.stakeholder.create({
        data: {
          name: data.name,
          organization: data.organization,
          email: data.email,
          phone: data.phone,
          type: data.type,
        },
      });

      return stakeholder;
    } catch (error) {
      this.logger.error('Error creating stakeholder', error);
      throw error;
    }
  }
}
