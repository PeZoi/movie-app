import { IsNotEmpty, IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateAuthDto {
  // i18n = I18nContext.current();

  @IsNotEmpty({ message: i18nValidationMessage('validator.EMAIL_REQUIRED') })
  @IsEmail({}, { message: i18nValidationMessage('validator.EMAIL_INVALID') })
  email: string;

  @IsNotEmpty({ message: 'validator.PASSWORD_REQUIRED' })
  password: string;
}
