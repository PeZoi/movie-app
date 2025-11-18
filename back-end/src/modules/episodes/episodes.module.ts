import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Episodes, EpisodeSchema } from './schema/episodes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Episodes.name, schema: EpisodeSchema }])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
