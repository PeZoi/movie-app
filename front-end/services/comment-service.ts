import http from "@/lib/http";
import { CommentType, CreateCommentRequestBody } from "@/types/comment-type";
import { ResponseType } from "@/types/response-type";

export const commentService = {
  getComments: (movieId: string, parentId?: string, episodeNumber?: string | number | undefined) => http.get<ResponseType<CommentType[]>>(`/api/v1/comment/list?movie_id=${movieId}${parentId ? `&parent_id=${parentId}` : ''}${episodeNumber ? `&episode_number=${episodeNumber}` : ''}`),
  createComment: (commentRequestBody: CreateCommentRequestBody) => {
    const params = new URLSearchParams();
    params.append('movie_id', commentRequestBody?.movie_id);
    if (commentRequestBody?.parent_id) {
      params.append('parent_id', commentRequestBody.parent_id);
    }
    if (commentRequestBody?.mention_id) {
      params.append('mention_id', commentRequestBody.mention_id);
    }
    params.append('content', commentRequestBody?.content);
    if (commentRequestBody?.episode_number !== null && commentRequestBody?.episode_number !== undefined) {
      params.append('episode_number', commentRequestBody.episode_number.toString());
    }
    params.append('is_spoil', commentRequestBody?.is_spoil?.toString());
    return http.post<ResponseType<CommentType>>('/api/v1/comment/add', params);
  },
  voteComment: (commentId: string, voteType: '0' | '1') => {
    const params = new URLSearchParams();
    params.append('comment_id', commentId);
    params.append('type', voteType);
    return http.post<ResponseType<CommentType[]>>(`/api/v1/comment/vote`, params);
  },
};