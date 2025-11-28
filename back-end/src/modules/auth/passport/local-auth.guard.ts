import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: info?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác',
          errors: [],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
