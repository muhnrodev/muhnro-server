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
import { ObjectModule } from './modules/object/object.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { WebpageModule } from './modules/webpage/webpage.module.js';
import { DataModule } from './modules/data/data.module.js';
import { AdminModule } from './modules/admin/admin.module.js';

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
    HealthModule,

    AuthModule,

    UserModule,
    NotificationModule,
    WebsiteModule,
    ComponentModule,
    ObjectModule,
    WebpageModule,
    DataModule,
    AdminModule,
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
