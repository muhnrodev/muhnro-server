import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { EventService } from '../auth/services/event.service.js';

@Module({
  providers: [UserService, EventService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
