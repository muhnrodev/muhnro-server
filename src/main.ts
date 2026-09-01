import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module.js';
import { winstonConfig } from './config/winston.config.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  app.setGlobalPrefix('api/v1');
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  if (!(globalThis as any).crypto) {
    (globalThis as any).crypto = crypto;
  }

  const config = new DocumentBuilder()
    .setTitle('Muhnro API')
    .setDescription(
      'API documentation for the Muhnro platform – Development Environment.',
    )
    .setVersion('1.0')
    .addTag('muhnro')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = new Set([
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://dev.dashboard.muhnro.com',
        'https://dashboard.muhnro.com',
      ]);

      try {
        const { hostname, protocol, port } = new URL(origin);
        const isLocalhost =
          hostname === 'localhost' || hostname.endsWith('.localhost');
        const isMuhnroSubdomain = hostname.endsWith('.muhnro.com');
        const isAllowed =
          allowedOrigins.has(origin) ||
          ((protocol === 'http:' || protocol === 'https:') &&
            (isLocalhost || isMuhnroSubdomain || hostname === 'muhnro.com'));

        if (port && !['80', '443'].includes(port) && !isLocalhost) {
          return callback(null, false);
        }

        return callback(null, isAllowed);
      } catch {
        return callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
