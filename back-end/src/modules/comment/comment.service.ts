import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Comment, CommentDocument } from '@/modules/comment/schemas/comment.schema';
import { CommentVote, CommentVoteDocument } from '@/modules/comment/schemas/commentVote.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(CommentVote.name) private CommentVoteModel: Model<CommentVoteDocument>,
  ) {}
  async createComment(dto: {
    movie_id: string;
    user_id: string;
    content: string;
    is_spoil: boolean;
    episode_number?: number;
    season_number?: number;
    parent_id?: string;
    mention_id?: string;
  }) {
    const result = await this.commentModel.create({
      movie_id: dto.movie_id,
      user_id: dto.user_id,
      content: dto.content,
      is_spoil: dto.is_spoil || false,
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

  async getCommentsById(query, user_id: string) {
    const { movie_id, season_number, episode_number, parent_id, current = 1, pageSize = 20 } = query;
    const filter = {
      movie_id: movie_id,
      episode_number: episode_number ? episode_number : 0,
      season_number: season_number ? season_number : 0,
      parent_id: parent_id ?? null,
    };

    const page = Number(current) > 0 ? Number(current) : 1;
    const limit = Number(pageSize) > 0 ? Number(pageSize) : 20;

    const totalItems = await this.commentModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const skip = (page - 1) * limit;

    const comments = await this.commentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user_id',
        select: 'name',
        populate: {
          path: 'avatar',
          select: 'path',
        },
      })
      .lean();

    const commentIds = comments.map((c) => c._id);

    const childrenAgg = await this.commentModel.aggregate([
      { $match: { parent_id: { $in: commentIds } } },
      { $group: { _id: '$parent_id', count: { $sum: 1 } } },
    ]);

    const childrenMap = new Map(childrenAgg.map((i) => [i._id.toString(), i.count]));

    let voteMap = new Map();
    if (user_id) {
      const votes = await this.CommentVoteModel.find({
        user_id,
        comment_id: { $in: commentIds },
      }).lean();

      voteMap = new Map(votes.map((v) => [v.comment_id.toString(), v.type]));
    }

    const result = comments.map((c) => {
      const user_info = c.user_id;
      const uid = user_info?._id || c.user_id;

      return {
        ...c,
        user_id: uid,
        user_info,
        total_children: childrenMap.get(c._id.toString()) ?? 0,
        is_like: voteMap.get(c._id.toString()) === 1,
        is_dislike: voteMap.get(c._id.toString()) === 0,
      };
    });
    return {
      data: {
        result,
        totalItems,
        totalPages,
      },
    };
  }

  async voteComment(dto: { comment_id: string; user_id: string; type: number }) {
    const { comment_id, user_id, type } = dto;

    const existingVote = await this.CommentVoteModel.findOne({
      comment_id,
      user_id,
    });

    if (existingVote && existingVote.type === type) {
      await existingVote.deleteOne();
    } else if (existingVote) {
      existingVote.type = type;
      await existingVote.save();
    } else {
      await this.CommentVoteModel.create({
        comment_id,
        user_id,
        type,
      });
    }

    const [total_like, total_dislike] = await Promise.all([
      this.CommentVoteModel.countDocuments({ comment_id, type: 1 }),
      this.CommentVoteModel.countDocuments({ comment_id, type: 0 }),
    ]);

    await this.commentModel.findByIdAndUpdate(comment_id, {
      total_like,
      total_dislike,
    });

    return {
      message: 'Thành công',
      data: {
        result: [{ total_like, total_dislike }],
      },
    };
  }
}
