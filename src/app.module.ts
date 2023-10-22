import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateSchema } from './configs/validate-schema';
import configuration from './configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/configs/env/.${process.env.NODE_ENV}.env`],
      load: [configuration],
      validationSchema: validateSchema(),
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
