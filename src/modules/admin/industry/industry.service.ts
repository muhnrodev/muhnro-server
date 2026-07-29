import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateIndustryDto, UpdateIndustryDto } from './industry.dto.js';

@Injectable()
export class IndustryService {
  private readonly logger = new Logger(IndustryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllIndustries() {
    try {
      const industries = await this.prisma.industry.findMany();
      return industries;
    } catch (error) {
      this.logger.error('Error fetching industries', error);
      throw error;
    }
  }

  async getIndustryById(industryId: string) {
    try {
      const industry = await this.prisma.industry.findUnique({
        where: { industryId },
      });

      if (!industry) {
        this.logger.warn(`Industry with ID "${industryId}" not found`);
        throw new NotFoundException('Industry not found');
      }

      return industry;
    } catch (error) {
      this.logger.error('Error fetching industry by ID', error);
      throw error;
    }
  }

  async createIndustry(data: CreateIndustryDto, user: string) {
    try {
      const existingIndustry = await this.prisma.industry.findUnique({
        where: { name: data.name },
      });

      if (existingIndustry) {
        this.logger.warn(`Industry with name "${data.name}" already exists`);
        throw new Error('Industry with this name already exists');
      }

      const industry = await this.prisma.industry.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          updatedBy: user,
        },
      });

      return {
        message: 'Industry created successfully',
        industry,
        industries: await this.getAllIndustries(),
      };
    } catch (error) {
      this.logger.error('Error creating industry', error);
      throw error;
    }
  }

  async updateIndustry(data: UpdateIndustryDto, user: string) {
    try {
      const existingIndustry = await this.prisma.industry.findUnique({
        where: { industryId: data.industryId },
      });

      if (!existingIndustry) {
        this.logger.warn(`Industry with ID "${data.industryId}" not found`);
        throw new NotFoundException('Industry not found');
      }

      const updatedIndustry = await this.prisma.industry.update({
        where: { industryId: data.industryId },
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          updatedBy: user,
        },
      });

      return {
        message: 'Industry updated successfully',
        industry: updatedIndustry,
        industries: await this.getAllIndustries(),
      };
    } catch (error) {
      this.logger.error('Error updating industry', error);
      throw error;
    }
  }

  async deleteIndustry(industryId: string) {
    try {
      const existingIndustry = await this.prisma.industry.findUnique({
        where: { industryId },
      });

      if (!existingIndustry) {
        this.logger.warn(`Industry with ID "${industryId}" not found`);
        throw new NotFoundException('Industry not found');
      }

      await this.prisma.industry.delete({
        where: { industryId },
      });

      return {
        message: 'Industry deleted successfully',
        industries: await this.getAllIndustries(),
      };
    } catch (error) {
      this.logger.error('Error deleting industry', error);
      throw error;
    }
  }
}
