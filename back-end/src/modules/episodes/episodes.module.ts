import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Apisodes, ApisodesSchema } from './schema/episodes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Apisodes.name, schema: ApisodesSchema }])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
