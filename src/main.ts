import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TransformInterceptor } from '@project-name/shared/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const env = configService.get('environment');

  const corsOption: CorsOptions = {};
  if (env === 'prod') {
    corsOption.origin = configService.get('allowedCorsOrigin');
  } else {
    corsOption.origin = '*';
  }
  app.enableCors(corsOption);

  const version = 'v1';
  app.setGlobalPrefix(version, {
    exclude: ['health'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

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
