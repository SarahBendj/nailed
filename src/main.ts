import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';


import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Serve static files from /bucket
  app.use('/bucket', express.static(join(__dirname, 'bucket')));


  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip properties that don't have decorators
      forbidNonWhitelisted: true,  // throw error if extra properties received
      transform: true,             // transform payloads to DTO instances
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Salon API')
    .setDescription('API to find nearby salons and more')
    .setVersion('1.0')
    .addTag('salons')
    .build();

    

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  

  await app.listen( 3000, '0.0.0.0');
  


}
bootstrap();

