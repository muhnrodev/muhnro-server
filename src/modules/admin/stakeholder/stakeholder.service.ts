import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStakeholderDto, UpdateStakeholderDto } from './stakeholder.dto';

@Injectable()
export class StakeholdersService {
  private readonly logger = new Logger(StakeholdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllStakeholders() {
    try {
      const stakeholders = await this.prisma.stakeholder.findMany();
      return stakeholders;
    } catch (error) {
      this.logger.error('Error fetching stakeholders', error);
      throw error;
    }
  }

  async getStakeholderById(stakeholderId: string) {
    try {
      const stakeholder = await this.prisma.stakeholder.findUnique({
        where: { stakeholderId },
      });

      if (!stakeholder) {
        this.logger.error(`Stakeholder with ID ${stakeholderId} not found`);
        throw new NotFoundException('Stakeholder not found');
      }

      return stakeholder;
    } catch (error) {
      this.logger.error('Error fetching stakeholder by ID', error);
      throw error;
    }
  }

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

      return {
        message: 'Stakeholder created successfully',
        stakeholder,
        stakeholders: await this.getAllStakeholders(),
      };
    } catch (error) {
      this.logger.error('Error creating stakeholder', error);
      throw error;
    }
  }

  async updateStakeholder(data: UpdateStakeholderDto) {
    try {
      const existingStakeholder = await this.getStakeholderById(
        data.stakeholderId,
      );

      if (!existingStakeholder) {
        this.logger.error(
          `Stakeholder with ID ${data.stakeholderId} not found`,
        );
        throw new NotFoundException('Stakeholder not found');
      }

      const stakeholder = await this.prisma.stakeholder.update({
        where: { stakeholderId: data.stakeholderId },
        data: {
          name: data.name,
          organization: data.organization,
          email: data.email,
          phone: data.phone,
          type: data.type,
        },
      });

      return {
        message: 'Stakeholder updated successfully',
        stakeholder,
        stakeholders: await this.getAllStakeholders(),
      };
    } catch (error) {
      this.logger.error('Error updating stakeholder', error);
      throw error;
    }
  }

  async deleteStakeholder(stakeholderId: string) {
    try {
      const existingStakeholder = await this.getStakeholderById(stakeholderId);

      if (!existingStakeholder) {
        this.logger.error(`Stakeholder with ID ${stakeholderId} not found`);
        throw new NotFoundException('Stakeholder not found');
      }

      await this.prisma.stakeholder.delete({
        where: { stakeholderId },
      });

      return {
        message: 'Stakeholder deleted successfully',
        stakeholders: await this.getAllStakeholders(),
      };
    } catch (error) {
      this.logger.error('Error deleting stakeholder', error);
      throw error;
    }
  }
}
