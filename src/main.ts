import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app/app.module';
import { AppConfig } from './app/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService<AppConfig, true>);

  app.enableCors();
  addSwaggerSupport(app, appConfig);

  await app.listen(
    appConfig.get('APP_PORT', { infer: true }),
    appConfig.get('APP_HOST', { infer: true }),
  );
}

function addSwaggerSupport(
  app: INestApplication,
  appConfig: ConfigService<AppConfig, true>,
): void {
  patchNestJsSwagger();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nomade')
    .setDescription('The Nomade API documentation')
    .setVersion(appConfig.get('APP_VERSION', { infer: true }))
    .addBearerAuth()
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, openApiDocument);
}

bootstrap();
