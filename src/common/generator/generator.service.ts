import { Global, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Global()
@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    try {
      const cleanFirst = firstName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const cleanLast = lastName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      let attempt = 1;
      let username = '';

      while (true) {
        const prefix = cleanFirst.substring(0, attempt);
        username = `${prefix}${cleanLast}`;

        const existingUser = await this.prisma.user.findUnique({
          where: { username },
        });

        if (!existingUser) {
          return username;
        }

        attempt++;

        if (attempt > cleanFirst.length) {
          const randomNumber = Math.floor(1000 + Math.random() * 9000);
          username = `${cleanFirst[0]}${cleanLast}${randomNumber}`;
          return username;
        }
      }
    } catch (error) {
      this.logger.error('Failed to generate username', error);
      throw error;
    }
  }
}
