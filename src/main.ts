import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Environment } from '@/common/constant/environment';
import { TransformResponseInterceptor } from '@/common/interceptor/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const env = configService.get('app.environment');

  const corsOption: CorsOptions = {};
  if (env === Environment.PROD) {
    corsOption.origin = configService.get('app.allowedCorsOrigin');
  } else {
    corsOption.origin = '*';
  }
  app.enableCors(corsOption);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const port = configService.get('app.port');
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`);
  });
}
bootstrap();
