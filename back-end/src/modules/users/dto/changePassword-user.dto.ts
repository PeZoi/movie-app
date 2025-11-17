import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
    },
    { message: i18nValidationMessage('validator.PASSWORD_STRONG') },
  )
  newPassword: string;
}
