import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GeneratorService } from '../../common/generator/generator.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly generator: GeneratorService,
  ) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserCredentials(userId: string) {
    return this.prisma.userCredential.findUnique({
      where: { userId },
    });
  }

  async;

  async createUser(data: CreateUserDto) {
    try {
      const existingUser = await this.findByEmail(data.email);

      if (existingUser) {
        this.logger.warn(
          `Attempt to register with existing email: ${data.email}`,
        );
        throw new ConflictException('Email already in use');
      }

      const username = await this.generator.generateUsername(
        data.firstName,
        data.lastName,
      );

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          displayName: `${data.firstName} ${data.lastName}`,
          username,
        },
      });

      await this.createUserCredentials(user.id, data.password);

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }

  async createUserCredentials(userId: string, password: string) {
    try {
      const hashedPassword = await this.hashPassword(password);
      await this.prisma.userCredential.create({
        data: {
          userId,
          passwordHash: hashedPassword,
          passwordAlgo: 'bcrypt',
        },
      });
    } catch (error) {
      throw new Error('Failed to create user credentials');
    }
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
