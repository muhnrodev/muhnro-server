import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { UserService } from '../user/user.service.js';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const userCredential = await this.userService.getUserCredentials(user.id);

      if (!userCredential)
        throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await compare(
        password,
        userCredential.passwordHash,
      );

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');

      return { id: user.id, email: user.email, username: user.username };
    } catch (error) {
      this.logger.error('Failed to validate user', error.stack);
      throw error;
    }
  }

  login(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) {
      return user;
    }

    return this.userService.createUser(googleUser);
  }
}
