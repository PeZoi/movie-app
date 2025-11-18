import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateEpisodeDto {
  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  server_name: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  is_ai: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  adult: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  slug: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  filename: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  link_embed: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  link_m3u8: string;
}
