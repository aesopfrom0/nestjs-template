import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateSchema } from './configs/validate-schema';
import { DatabaseModule } from './providers/database/database.module';
import configuration from './configs/configuration';
import TrackRequestMiddleware from './providers/middlewares/track-request-middleware.middleware';
import { ShutdownModule } from './providers/shutdown/shutdown.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/shared/filters/all-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/configs/env/.env.${process.env.NODE_ENV}`],
      load: [configuration],
      validationSchema: validateSchema(),
      validationOptions: {
        abortEarly: true,
      },
    }),
    DatabaseModule,
    ShutdownModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackRequestMiddleware).exclude('health').forRoutes('*');
  }
}
