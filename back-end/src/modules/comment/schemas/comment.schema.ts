import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true })
  movie_id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  parent_id: Types.ObjectId | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  mention_id: Types.ObjectId | null;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  episode_number: number;

  @Prop({ default: 0 })
  total_children: number;

  @Prop({ default: 0 })
  season_number: number;

  @Prop({ default: 0 })
  total_like: number;

  @Prop({ default: 0 })
  total_dislike: number;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
