import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty({ message: i18nValidationMessage('country.COUNTRYNAME_REQUIRED') })
  name: string;
}
