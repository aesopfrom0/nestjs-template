import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LogLevel, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env = configService.get('environment');

  const logLevel = ['log', 'error', 'warn'] as LogLevel[];
  if (env === 'prod') {
    app.useLogger(logLevel);
  } else {
    app.useLogger(logLevel.concat('debug'));
  }

  const version = 'v1';
  app.setGlobalPrefix(version, {
    exclude: [],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  const options = new DocumentBuilder()
    .setTitle('NESTJS-TEMPLATE')
    .setDescription('NESTJS-TEMPLATE API')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(version, app, document);

  const port = configService.get('port');
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`);
  });
}
bootstrap();
