import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Comment, CommentDocument } from '@/modules/comment/schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private EpisodesModel: Model<User>,
  ) {}
  async createComment(dto: {
    movie_id: string;
    user_id: string;
    content: string;
    episode_number?: number;
    season_number?: number;
    parent_id?: string;
    mention_id?: string;
  }) {
    const result = await this.commentModel.create({
      movie_id: dto.movie_id,
      user_id: dto.user_id,
      content: dto.content,
      episode_number: dto.episode_number || 0,
      season_number: dto.season_number || 0,
      parent_id: dto.parent_id ? new Types.ObjectId(dto.parent_id) : null,
      mention_id: dto.mention_id ? new Types.ObjectId(dto.mention_id) : null,
    });

    return {
      data: {
        result,
      },
    };
  }

  async getCommentsById(query) {
    const comments = await this.commentModel
      .find({
        movie_id: query.movie_id,
        episode_number: query.episode_number ?? 0,
        season_number: query.season_number ?? 0,
        parent_id: query.parent_id ?? null,
      })
      .populate({
        path: 'user_id',
        select: 'name',
        populate: {
          path: 'avatar',
          select: 'path',
        },
      })
      .lean();

    const result = comments.map((c) => {
      const user_info = c.user_id;
      const user_id = c.user_id?._id || c.user_id;

      return {
        ...c,
        user_id,
        user_info,
      };
    });
    return {
      data: {
        result,
      },
    };
  }
}
