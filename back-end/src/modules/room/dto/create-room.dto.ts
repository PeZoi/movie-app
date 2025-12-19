import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsMongoId()
  movie_id: string;

  @IsOptional()
  @IsString()
  poster_url?: string;

  @IsOptional()
  time_start?: Date;

  @IsOptional()
  auto_start?: boolean;

  @IsOptional()
  is_private?: boolean;

  @IsOptional()
  episode_number?: number;

  @IsOptional()
  season_number?: number;
}
