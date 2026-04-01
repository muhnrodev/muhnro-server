import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { UserModule } from '../user/user.module.js';
import { NotificationController } from './notification.controller.js';

@Module({
  imports: [UserModule],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [UserModule],
})
export class NotificationModule {}
