import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
import { I18nValidationException } from 'nestjs-i18n';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof I18nValidationException) {
          return throwError(() => error);
        }

        if (error instanceof HttpException) {
          const status = error.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
          const response: any = error.getResponse?.() ?? {};
          const message = response?.message || error.message || 'Có lỗi xảy ra';

          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message,
                  statusCode: status,
                  error: response.error || error.name,
                },
                status,
              ),
          );
        }

        return throwError(
          () =>
            new HttpException(
              {
                success: false,
                message: error?.message || 'Lỗi không xác định',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'InternalServerError',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
