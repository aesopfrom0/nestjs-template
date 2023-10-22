import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const env = configService.get('NODE_ENV');
  const port = configService.get('port');
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`);
  });
}
bootstrap();
