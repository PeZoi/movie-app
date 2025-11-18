import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EpisodesDocument = HydratedDocument<Episodes>;

@Schema()
export class ServerData {
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

export const ServerDataSchema = SchemaFactory.createForClass(ServerData);

@Schema({ timestamps: true })
export class Episodes {
  @Prop()
  server_name: string;

  @Prop()
  is_ai: boolean;

  @Prop({
    type: [ServerDataSchema],
    default: [],
  })
  server_data: ServerData[];
}

export const EpisodeSchema = SchemaFactory.createForClass(Episodes);
