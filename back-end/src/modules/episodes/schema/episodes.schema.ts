import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ApisodesDocument = HydratedDocument<Apisodes>;

@Schema({ timestamps: true })
export class Apisodes {
  @Prop()
  server_name: string;

  @Prop()
  is_ai: boolean;

  @Prop()
  adult: boolean;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  filename: string;

  @Prop()
  link_embed: string;

  @Prop()
  link_m3u8: string;
}

export const ApisodeSchema = SchemaFactory.createForClass(Apisodes);
