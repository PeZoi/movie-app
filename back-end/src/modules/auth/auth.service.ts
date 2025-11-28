import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';

import { comparePasswordHelper, hashPasswordHelper } from '../../helper/util';
import { UsersService } from '@/modules/users/users.service';
import { UserResponseDto } from '@/modules/auth/dto/res-user.dto';
import { ChangePasswordDto } from '@/modules/users/dto/changePassword-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      data: {
        result: new UserResponseDto(user),
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }

  async changePassword(email: string, dto: ChangePasswordDto) {
    const i18n = I18nContext.current();

    const { oldPassword, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(I18nContext.current().t('auth.PASSWORD_CONFIRM_NOT_MATCH'));
    }

    const isUserExist = await this.usersService.isEmailExist(email);
    if (!isUserExist) throw new BadRequestException(I18nContext.current().t('user.USER_NOT_FOUND'));
    const user = await this.usersService.findByEmail(email);

    const isMatch = await comparePasswordHelper(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException(I18nContext.current().t('auth.OLD_PASSWORD_INCORRECT'));

    const hash = await hashPasswordHelper(newPassword);
    user.password = hash;
    await user.save();

    const message = await i18n.t('auth.PASSWORD_UPDATE_SUCCESS');

    return {
      message,
      data: {
        result: { _id: user._id },
      },
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException(I18nContext.current().t('user.USER_NOT_FOUND'));
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(I18nContext.current().t('auth.LOGIN_FAIL'));
    }
    if (!user || !isValidPassword) return null;
    return user;
  }
}
