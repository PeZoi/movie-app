import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        message: data?.message ?? 'Thành công',
        data: data?.data ?? data,
      })),
    );
  }
}
