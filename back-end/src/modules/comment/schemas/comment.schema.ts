import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Movie } from '../../movie/schemas/movie.schema';

export type CommentDocument = HydratedDocument<Comments>;

@Schema({ timestamps: true })
export class Comments {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true })
  movie: Movie;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null })
  parentCommentId?: Types.ObjectId | null;
}
export const CommentSchema = SchemaFactory.createForClass(Comments);
