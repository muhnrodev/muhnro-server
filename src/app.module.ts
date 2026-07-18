import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { GeneratorModule } from './common/generator/generator.module.js';
import { UserModule } from './modules/user/user.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard.js';
import { WebsiteModule } from './modules/website/website.module.js';
import { ComponentModule } from './modules/component/component.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 1000,
          limit: 100,
        },
      ],
    }),

    PrismaModule,
    GeneratorModule,

    AuthModule,

    UserModule,
    NotificationModule,
    WebsiteModule,
    ComponentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
