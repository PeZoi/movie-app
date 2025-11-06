import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  // i18n = I18nContext.current();

  @IsNotEmpty({ message: 'validator.USERNAME_REQUIRED' })
  username: string;

  @IsNotEmpty({ message: 'validator.PASSWORD_REQUIRED' })
  password: string;
}
