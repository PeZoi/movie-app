import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
  @IsMongoId({ message: i18nValidationMessage('validator.ID_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('validator.ID_REQUIRED') })
  _id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  image: string;

  @IsOptional()
  gender: string;
}
