import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class MovieFilterDto {
  @IsOptional()
  countries?: string;

  @IsOptional()
  categories?: string[];

  @IsOptional()
  years?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  current?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  pageSize?: number;
}
