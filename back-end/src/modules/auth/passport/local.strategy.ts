import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { I18nContext } from 'nestjs-i18n';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(I18nContext.current().t('auth.LOGIN_FAIL'));
    }
    return user;
  }
}
