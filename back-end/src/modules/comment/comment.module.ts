import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from '@/modules/comment/schemas/comment.schema';
import { User, UserSchema } from '@/modules/users/schemas/user.schema';
import { CommentVote, CommentVoteSchema } from '@/modules/comment/schemas/commentVote.schema';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: CommentVote.name, schema: CommentVoteSchema }]),
  ],
})
export class CommentModule {}
