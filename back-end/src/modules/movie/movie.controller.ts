import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('category/:slug')
  async getMovieByCategory(
    @Param('slug') slug: string,
    @Query('current') current?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.movieService.getMovieByCategory(slug, current, pageSize);
  }

  @Get('country/:slug')
  async getMovieByCountry(
    @Param('slug') slug: string,
    @Query('current') current?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.movieService.getMovieByCountry(slug, current, pageSize);
  }

  @Get('actor/:id')
  async getMovieByActor(@Param('id') id: string) {
    return this.movieService.getMovieByActor(id);
  }

  @Get(':slug')
  async getMovieById(@Param('slug') slug: string) {
    return this.movieService.getMovieBySlug(slug);
  }

  @Post(':slug')
  async syncMovie(@Param('slug') slug: string) {
    return this.movieService.syncMovie(slug);
  }

  @Post('/list/:slug')
  async syncMovieList(@Param('slug') slug: string) {
    return this.movieService.syncMovieList(slug);
  }
}
