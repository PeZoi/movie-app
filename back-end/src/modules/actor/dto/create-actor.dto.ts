import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty } from 'class-validator';

export class CreateActorDto {
  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  actor_id: number;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  original_name: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  gender: number;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  gender_name: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  adult: boolean;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  known_for_department: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  profile_path: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  character: string;

  @IsNotEmpty({ message: i18nValidationMessage('category.CATEGORYNAME_REQUIRED') })
  also_known_as: [];
}
