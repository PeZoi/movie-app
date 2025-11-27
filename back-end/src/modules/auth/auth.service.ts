import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

  // async signIn(email: string, pass: string): Promise<any> {
  //   const i18n = I18nContext.current();

  //   const user = await this.usersService.findByEmail(email);

  //   if (!user) {
  //     throw new BadRequestException(i18n.t('auth.LOGIN_FAIL'));
  //   }
  //   const isValidPassword = await comparePasswordHelper(pass, user?.password);
  //   if (!isValidPassword) {
  //     throw new BadRequestException(i18n.t('auth.LOGIN_FAIL'));
  //   }

  //   const payload = { sub: user?._id, email: user?.email };
  //   const message = await i18n.t('auth.LOGIN_SUCCESS');

  //   return {
  //     message,
  //     data: {
  //       result: new UserResponseDto(user),
  //       access_token: await this.jwtService.signAsync(payload),
  //     },
  //   };
  // }

  async signIn(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Username/Password không hợp lệ.');
      if (!user || !isValidPassword) return null;
      return user;
    }
  }
}
