export interface Avatar {
  group_id: string;
  path: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  avatar: Avatar;
}

export interface CommentType {
  _id: string;
  movie_id: string;
  user_id: string;
  parent_id: string | null;
  mention_id: string | null;
  content: string;
  episode_number: number;
  is_spoil: boolean;
  total_children: number;
  season_number: number;
  total_like: number;
  total_dislike: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user_info: UserInfo;
  is_like: boolean;
  is_dislike: boolean;
}

export interface CreateCommentRequestBody {
  movie_id: string;
  parent_id: string | null;
  mention_id: string | null;
  content: string;
  episode_number: number | null;
  is_spoil: boolean;
}