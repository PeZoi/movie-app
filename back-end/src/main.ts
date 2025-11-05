import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app.module';
import { ErrorInterceptor } from '@/common/interceptors/error.interceptor';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api/v1', { exclude: [''] }); // Exclude root path from global prefix
  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));
  await app.listen(port || 8080);
}
bootstrap();
