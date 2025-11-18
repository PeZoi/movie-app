import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { ActorModule } from '../actor/actor.module';
import { Category, CategorySchema } from '@/modules/category/schemas/category.schema';
import { Country, CountrySchema } from '@/modules/country/schemas/country.schema';
import { Episodes, EpisodeSchema } from '@/modules/episodes/schema/episodes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    MongooseModule.forFeature([{ name: Episodes.name, schema: EpisodeSchema }]),
    ActorModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
