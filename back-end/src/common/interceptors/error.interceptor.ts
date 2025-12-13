import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { I18nValidationException } from 'nestjs-i18n';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((error) => from(this.handleError(error)).pipe(mergeMap((err) => throwError(() => err)))));
  }

  private async handleError(error: any) {
    // Validation error
    if (error instanceof I18nValidationException) {
      const errorsArray: any[] = (error as any).errors || [];
      const mappedErrors = errorsArray.map((err) => ({
        field: err.property || 'unknown',
        messages: Object.values(err.constraints || {}),
      }));

      return new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: mappedErrors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // HttpException đã chuẩn hóa (bao gồm JWT)
    if (error instanceof HttpException) {
      const status = error.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const response: any = error.getResponse?.() ?? {};
      const message = response?.message || error.message || '';
      const errors = Array.isArray(response?.errors) ? response.errors : [];

      return new HttpException(
        {
          success: false,
          statusCode: status,
          message,
          errors,
        },
        status,
      );
    }

    // Lỗi khác
    return new HttpException(
      {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error?.message || '',
        errors: [],
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
