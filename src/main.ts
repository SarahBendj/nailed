import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 'loopback');

  app.use('/bucket', express.static(join(__dirname, 'bucket')));

  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
  const hasOrigins = (corsOrigins?.length ?? 0) > 0;
  app.enableCors({
    origin: hasOrigins ? corsOrigins : '*',
    credentials: hasOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('');
  const bearerAuth = {
    type: 'http' as const,
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
  };

  const clientConfig = new DocumentBuilder()
    .setTitle('Hall API — Client')
    .setDescription('Client gateway: browse halls, nearest search, best rated, hall services.')
    .setVersion('1.0')
    .addTag('Client')
    .addBearerAuth(bearerAuth, 'JWT')
    .build();

  const ownerConfig = new DocumentBuilder()
    .setTitle('Hall API — Owner')
    .setDescription('Owner gateway: auth, manage halls, uploads.')
    .setVersion('1.0')
    .addTag('Owner')
    .addBearerAuth(bearerAuth, 'JWT')
    .build();


  const fullDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Fox Visit API')
      .setVersion('1.0')
      .addBearerAuth(bearerAuth, 'JWT')
      .build(),
  );

  const ownerDocument = {
    ...fullDocument,
    paths: Object.fromEntries(
      Object.entries(fullDocument.paths).filter(([path]) => {
        const seg2 = path.split('/')[2];
        return seg2 === 'owner' || path.startsWith('/hall');
      }),
    ),
  };

  const clientDocument = {
    ...fullDocument,
    paths: Object.fromEntries(
      Object.entries(fullDocument.paths).filter(([path]) => {
        const seg2 = path.split('/')[2];
        return seg2 === 'client' || path.startsWith('/hall');
      }),
    ),
  };
  
    SwaggerModule.setup('wedding-hall/owner', app, ownerDocument, {
      swaggerOptions: { persistAuthorization: true },
    });
  
    SwaggerModule.setup('wedding-hall/client', app, clientDocument, {
      swaggerOptions: { persistAuthorization: true },
    });
  

  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  Logger.log(`Server is running on http://0.0.0.0:${port}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});