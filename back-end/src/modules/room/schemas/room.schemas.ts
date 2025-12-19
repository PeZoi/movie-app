import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop()
  poster_url: string;

  @Prop({ default: 0 })
  estimated_time?: number;

  @Prop({ default: 0 })
  end_time?: number;

  @Prop({ default: 0 })
  player_start_time?: number;

  @Prop({ default: 0 })
  total_remind?: number;

  @Prop({ default: 0 })
  total_views?: number;

  @Prop({ default: 0 })
  status?: number;

  @Prop({ default: 0 })
  online?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true })
  movie_id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
  host_id: Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  users: Types.ObjectId[];

  @Prop()
  time_start?: Date;

  @Prop({ default: false })
  auto_start?: boolean;

  @Prop({ default: false })
  is_private?: boolean;

  @Prop()
  last_active: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ hostId: 1, movie_id: 1 }, { unique: true });
