import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
  I18nModule,
  I18nJsonLoader,
} from 'nestjs-i18n';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CountryModule } from './modules/country/country.module';
import { CategoryModule } from './modules/category/category.module';
import { ActorModule } from './modules/actor/actor.module';
import { MovieModule } from './modules/movie/movie.module';
import { CommentModule } from './modules/comment/comment.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { ErrorInterceptor } from '@/common/interceptors/error.interceptor';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ImageModule } from './modules/image/image.module';
import { CollectionModule } from './modules/collection/collection.module';
import { JwtAuthGuard } from '@/modules/auth/passport/jwt-auth.guard';
import { RoomModule } from './modules/room/room.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'vi',
        loader: I18nJsonLoader,
        loaderOptions: {
          path: path.join(process.cwd(), 'src', 'i18n'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CountryModule,
    CategoryModule,
    ActorModule,
    MovieModule,
    CommentModule,
    EpisodesModule,
    ImageModule,
    CollectionModule,
    RoomModule,
  ],
})
export class AppModule {}
