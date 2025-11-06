import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';

import { comparePasswordHelper } from '../../helper/util';
import { UsersService } from '@/modules/users/users.service';
import { UserResponseDto } from '@/modules/auth/dto/res-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const i18n = I18nContext.current();

    const user = await this.usersService.findByEmail(username);

    if (!user) {
      throw new BadRequestException(i18n.t('auth.LOGIN_FAIL'));
    }
    const isValidPassword = await comparePasswordHelper(pass, user?.password);
    if (!isValidPassword) {
      throw new BadRequestException(i18n.t('auth.LOGIN_FAIL'));
    }

    const payload = { sub: user?._id, username: user?.email };
    const message = await i18n.t('auth.LOGIN_SUCCESS');

    return {
      message,
      data: {
        user: new UserResponseDto(user),
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }
}
