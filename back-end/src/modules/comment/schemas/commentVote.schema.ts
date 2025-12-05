import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type CommentVoteDocument = HydratedDocument<CommentVote>;

@Schema({ timestamps: true })
export class CommentVote {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true })
  comment_id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ enum: [0, 1], required: true }) // 1 = like, 0 = dislike
  type: number;
}

export const CommentVoteSchema = SchemaFactory.createForClass(CommentVote);
