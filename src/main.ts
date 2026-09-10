import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module.js';
import { winstonConfig } from './config/winston.config.js';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

const requestBodyLimit = process.env.REQUEST_BODY_LIMIT ?? '50mb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
    bodyParser: false,
  });
  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: requestBodyLimit }));
  app.use(urlencoded({ extended: true, limit: requestBodyLimit }));
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
      const isAllowed =
        origin.endsWith('muhnro.com') ||
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:3000' ||
        origin === 'http://localhost:3001';

      callback(null, isAllowed);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
