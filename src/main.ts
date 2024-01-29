import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('NESTJS-TEMPLATE')
    .setDescription('NESTJS-TEMPLATE API')
    .setVersion('v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1', app, document);

  const configService = app.get(ConfigService);

  const env = configService.get('NODE_ENV');
  const port = configService.get('port');
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`);
  });
}
bootstrap();
