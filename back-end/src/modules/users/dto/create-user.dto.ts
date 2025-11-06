import { IsEmail, IsNotEmpty, IsStrongPassword, IsOptional, IsEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validator.USERNAME_REQUIRED') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage('validator.EMAIL_REQUIRED') })
  @IsEmail({}, { message: i18nValidationMessage('validator.EMAIL_INVALID') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validator.PASSWORD_REQUIRED') })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: i18nValidationMessage('validator.PASSWORD_STRONG') },
  )
  password: string;

  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'], {
    message: i18nValidationMessage('validator.DATA_INVALID'),
  })
  gender: string;

  @IsOptional()
  image: string;
}
