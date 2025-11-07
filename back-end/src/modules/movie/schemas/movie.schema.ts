import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Comment } from '../../comment/schemas/comment.schema';
import { Country } from '@/modules/country/schemas/country.schema';
import { Apisodes } from '@/modules/episodes/schema/episodes.schema';
import { Category } from '@/modules/category/schemas/category.schema';
import { Actor } from '@/modules/actor/schemas/actor.schema';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  originName: string;

  @Prop()
  description: string;

  @Prop()
  content: string;

  @Prop()
  is_copyright: boolean;

  @Prop()
  sub_docquyen: boolean;

  @Prop()
  chieurap: boolean;

  @Prop()
  year: number;

  @Prop()
  language: string;

  @Prop()
  posterUrl: string;

  @Prop()
  thumbUrl: string;

  @Prop()
  trailerUrl: string;

  @Prop()
  status: string;

  @Prop()
  quality: string;

  @Prop()
  episodeTotal: number;

  @Prop({ default: 0 })
  views: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }])
  countries: Country[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }])
  actors: Actor[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
  category: Category[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Apisodes' }])
  episodes: Apisodes[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  comments: Comment[];
}
export const MovieSchema = SchemaFactory.createForClass(Movie);
