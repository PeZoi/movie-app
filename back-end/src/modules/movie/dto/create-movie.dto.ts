import { IsString, IsArray, IsInt, IsBoolean, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class SeoSchemaDto {
  @IsString()
  '@context': string;

  @IsString()
  '@type': string;

  @IsString()
  name: string;

  @IsString()
  dateModified: string;

  @IsString()
  dateCreated: string;

  @IsString()
  url: string;

  @IsString()
  datePublished: string;

  @IsString()
  image: string;

  @IsString()
  director: string;
}

class SeoOnPageDto {
  @IsString()
  og_type: string;

  @IsString()
  titleHead: string;

  @ValidateNested()
  @Type(() => SeoSchemaDto)
  seoSchema: SeoSchemaDto;

  @IsString()
  descriptionHead: string;

  @IsArray()
  @IsString({ each: true })
  og_image: string[];

  @IsInt()
  updated_time: number;

  @IsString()
  og_url: string;
}

class BreadCrumbDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsInt()
  position: number;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}

class ParamsDto {
  @IsString()
  slug: string;
}

class ImdbDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsInt()
  vote_average?: number;

  @IsOptional()
  @IsInt()
  vote_count?: number;
}

class MovieItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  originName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;

  @IsOptional()
  @IsString()
  thumbUrl?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  episodeCurrent?: string;

  @IsOptional()
  @IsString()
  episodeTotal?: string;

  @IsOptional()
  @IsString()
  quality?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  notify?: string;

  @IsOptional()
  @IsString()
  showtimes?: string;

  @IsOptional()
  @IsBoolean()
  isCopyright?: boolean;

  @IsOptional()
  @IsBoolean()
  subDocQuyen?: boolean;

  @IsOptional()
  @IsBoolean()
  chieuRap?: boolean;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsInt()
  view?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImdbDto)
  imdb?: ImdbDto;

  @IsOptional()
  @IsObject()
  created?: {
    time: string;
  };

  @IsOptional()
  @IsObject()
  modified?: {
    time: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  directors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categorys?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countrys?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  episodes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateMovieDto {
  @ValidateNested()
  @Type(() => SeoOnPageDto)
  seoOnPage: SeoOnPageDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreadCrumbDto)
  breadCrumb: BreadCrumbDto[];

  @ValidateNested()
  @Type(() => ParamsDto)
  params: ParamsDto;

  @ValidateNested()
  @Type(() => MovieItemDto)
  item: MovieItemDto;
}
