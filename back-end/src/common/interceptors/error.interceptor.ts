// import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
// import { Observable, from, throwError } from 'rxjs';
// import { catchError, mergeMap } from 'rxjs/operators';
// import { I18nValidationException, I18nService } from 'nestjs-i18n';

// @Injectable()
// export class ErrorInterceptor implements NestInterceptor {
//   constructor(private readonly i18n: I18nService) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next
//       .handle()
//       .pipe(
//         catchError((error) => from(this.handleError(error, context)).pipe(mergeMap((err) => throwError(() => err)))),
//       );
//   }

//   private async handleError(error: any, context: ExecutionContext) {
//     const ctx = context.switchToHttp();
//     const request = ctx.getRequest<Request>();
//     const lang = (request as any).i18nLang || 'vi';

//     if (error instanceof I18nValidationException) {
//       const errorsArray: any[] = (error as any).errors || [];
//       const mappedErrors = await Promise.all(
//         errorsArray.map(async (err) => ({
//           field: err.property || 'unknown',
//           messages: await Promise.all(
//             Object.values(err.constraints || {}).map(async (msgKey: string) => {
//               const [key] = msgKey.split('|');
//               return this.i18n.translate(key, { lang });
//             }),
//           ),
//         })),
//       );

//       return new HttpException(
//         {
//           success: false,
//           statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//           message: 'Validation failed',
//           errors: mappedErrors,
//         },
//         HttpStatus.UNPROCESSABLE_ENTITY,
//       );
//     }

//     if (error instanceof HttpException) {
//       const status = error.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
//       const response: any = error.getResponse?.() ?? {};
//       const message = response?.message || error.message || 'Có lỗi xảy ra';
//       const errors = Array.isArray(response?.errors) ? response.errors : [];

//       return new HttpException(
//         {
//           success: false,
//           statusCode: status,
//           message,
//           errors,
//         },
//         status,
//       );
//     }

//     // Lỗi khác
//     return new HttpException(
//       {
//         success: false,
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: error?.message || 'Lỗi không xác định',
//         errors: [],
//         timestamp: new Date().toISOString(),
//         error: 'InternalServerError',
//       },
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }

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
