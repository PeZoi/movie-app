import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  name: string;
}
