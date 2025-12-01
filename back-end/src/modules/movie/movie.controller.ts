import { Controller, Get, Post, Param, Query } from '@nestjs/common';

import { MovieService } from './movie.service';
import { Public } from '@/decorator/customize';
import { MovieFilterDto } from '@/modules/movie/dto/filter-movie.dto';
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('category/:slug')
  @Public()
  async getMovieByCategory(
    @Param('slug') slug: string,
    @Query('current') current?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.movieService.getMovieByCategory(slug, current, pageSize);
  }

  @Get('country/:slug')
  @Public()
  async getMovieByCountry(
    @Param('slug') slug: string,
    @Query('current') current?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.movieService.getMovieByCountry(slug, current, pageSize);
  }

  @Get('actor/:id')
  @Public()
  async getMovieByActor(@Param('id') id: string) {
    return this.movieService.getMovieByActor(id);
  }

  @Get('filter')
  @Public()
  async getMovieFilter(@Query() dto: MovieFilterDto) {
    return this.movieService.getMovieFilter(dto);
  }

  @Get(':slug')
  @Public()
  async getMovieById(@Param('slug') slug: string) {
    return this.movieService.getMovieBySlug(slug);
  }

  @Post(':slug')
  @Public()
  async syncMovie(@Param('slug') slug: string) {
    return this.movieService.syncMovie(slug);
  }

  @Post('/list/:slug')
  @Public()
  async syncMovieList(@Param('slug') slug: string) {
    return this.movieService.syncMovieList(slug);
  }
}
