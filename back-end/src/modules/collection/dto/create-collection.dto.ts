import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  order: number;

  @IsNumber()
  style: number;

  @IsBoolean()
  @IsOptional()
  random_data?: boolean;

  @IsNumber()
  type: number;

  @IsObject()
  filter: {
    country_code?: string[];
    status?: string;
    type?: string;
    top_views?: string;
    limit?: number;
    sort_by?: string;
    order?: number;
  };
}
