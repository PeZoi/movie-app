import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Comment, CommentDocument } from '@/modules/comment/schemas/comment.schema';
import { CommentVote, CommentVoteDocument } from '@/modules/comment/schemas/commentVote.schema';
import { Movie, MovieDocument } from '@/modules/movie/schemas/movie.schema';
import { Review, ReviewDocument } from '@/modules/comment/schemas/review.schema';
import { checkExist } from '@/helper/util';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(CommentVote.name) private CommentVoteModel: Model<CommentVoteDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
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
    is_review?: boolean;
    point?: number;
  }) {
    await checkExist(this.movieModel, dto.movie_id, 'Phim không tồn tại');
    let rootParentId = null;
    let review = null;

    if (dto?.is_review) {
      if (dto.point == null) {
        throw new Error('Point không tồn tại');
      }
      review = await this.handleReview({
        movie_id: dto.movie_id,
        user_id: dto.user_id,
        point: dto.point,
        content: dto.content,
      });
    }

    if (dto.parent_id) {
      const parentComment = await this.commentModel.findById(dto.parent_id).lean();
      if (!parentComment.parent_id) {
        rootParentId = dto.parent_id;
      } else {
        rootParentId = parentComment.parent_id;
      }
    }

    const comment = await this.commentModel.create({
      movie_id: dto.movie_id,
      user_id: dto.user_id,
      content: dto.content,
      is_review: dto.is_review || false,
      is_spoil: dto.is_spoil || false,
      episode_number: dto.episode_number || 0,
      season_number: dto.season_number || 0,
      parent_id: rootParentId ? new Types.ObjectId(rootParentId) : null,
      mention_id: dto.mention_id ? new Types.ObjectId(dto.mention_id) : null,
      review_id: review?._id ?? null,
    });

    const result = (await this.commentModel
      .findById(comment._id)
      .populate({
        path: 'user_id',
        select: 'name',
        populate: {
          path: 'avatar',
          select: 'path',
        },
      })
      .lean()) as any;

    result.user_info = result.user_id;
    result.user_id = result.user_id._id;

    return {
      data: {
        result,
      },
    };
  }

  async getCommentsById(query, user_id: string) {
    const { movie_id, season_number, episode_number, parent_id, is_review = false, current = 1, pageSize = 20 } = query;
    const sortOption = parent_id != null ? ({ createdAt: 1 } as any) : ({ createdAt: -1 } as any);
    const filter: any = {
      movie_id: movie_id,
      season_number: season_number ? season_number : 0,
      parent_id: parent_id ?? null,
      is_review: is_review ?? false,
    };

    if (episode_number && episode_number > 0) {
      filter.episode_number = Number(episode_number);
    }

    const page = Number(current) > 0 ? Number(current) : 1;
    const limit = Number(pageSize) > 0 ? Number(pageSize) : 20;

    const totalItems = await this.commentModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const skip = (page - 1) * limit;

    let queryExec = this.commentModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user_id',
        select: 'name',
        populate: {
          path: 'avatar',
          select: 'path',
        },
      });

    if (is_review) {
      queryExec = queryExec.populate({
        path: 'review_id',
        select: 'point content createdAt updatedAt',
      });
    }

    const comments = await queryExec.lean();

    if (is_review) {
      (comments as any[]).forEach((c: any) => {
        c.review_info = c.review_id;
        c.review_id = c.review_id?._id;
      });
    }

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

    if (existingVote && existingVote.type === Number(type)) {
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

    const updateComment = (await this.commentModel
      .findByIdAndUpdate(
        comment_id,
        {
          total_like,
          total_dislike,
        },
        { new: true },
      )
      .populate({
        path: 'user_id',
        select: 'name',
        populate: {
          path: 'avatar',
          select: 'path',
        },
      })
      .lean()) as any;

    const userFinalVote = await this.CommentVoteModel.findOne({
      comment_id,
      user_id,
    });

    const is_like = !!(userFinalVote && userFinalVote.type === 1);
    const is_dislike = !!(userFinalVote && userFinalVote.type === 0);
    const result = { ...updateComment, is_dislike, is_like };
    result.user_info = result.user_id;
    result.user_id = result.user_id._id;
    return {
      message: 'Thành công',
      data: {
        result: [result],
      },
    };
  }

  async handleReview(dto: { movie_id: string; user_id: string; point: number; content: string }) {
    let review = await this.reviewModel.findOne({
      movie_id: dto.movie_id,
      user_id: dto.user_id,
    });

    if (!review) {
      review = await this.reviewModel.create({
        movie_id: dto.movie_id,
        user_id: dto.user_id,
        point: dto.point,
        content: dto.content,
      });
    } else {
      review.point = dto.point;
      review.content = dto.content;
      await review.save();
    }

    return review;
  }
}
