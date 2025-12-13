import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '@/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      try {
        super.canActivate(context) || true;
      } catch (e) {
        return true;
      }
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isPublic && (err || !user)) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Access Token không hợp lệ hoặc không có tại header.',
          errors: [],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
