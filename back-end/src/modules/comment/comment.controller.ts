import { Controller, Get, Post, Body, Req, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('add')
  @UseInterceptors(AnyFilesInterceptor())
  async createComment(
    @Body(new ValidationPipe({ transform: true }))
    dto: {
      movie_id: string;
      content: string;
      is_spoil: boolean;
      episode_number?: number;
      season_number?: number;
      parent_id?: string;
      mention_id?: string;
    },
    @Req()
    req,
  ) {
    const userId = req.user.id;
    return this.commentService.createComment({ ...dto, user_id: userId });
  }

  @Post('vote')
  async voteComment(
    @Body()
    dto: {
      comment_id: string;
      type: number;
    },
    @Req()
    req,
  ) {
    const userId = req.user.id;
    return this.commentService.voteComment({ ...dto, user_id: userId });
  }

  @Get('list')
  async getCommentsById(
    @Query()
    query: {
      movie_id: string;
      episode_number?: number;
      season_number?: number;
      parent_id?: string;
      current: number;
      pageSize: number;
    },
    @Req()
    req,
  ) {
    const userId = req.user.id;
    return this.commentService.getCommentsById(query, userId);
  }
}
