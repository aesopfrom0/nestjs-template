import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateSchema } from './config/validate-schema';
import { DatabaseModule } from './provider/database/database.module';
import configuration from './config/configuration';
import TrackRequestMiddleware from './provider/middlewares/track-request-middleware.middleware';
import { ShutdownModule } from './provider/shutdown/shutdown.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: [`.env.${process.env.NODE_ENV}`],
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
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackRequestMiddleware).exclude('health').forRoutes('*');
  }
}
