'use client';

import CommentForm from '@/components/comment/comment-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RO_PHIM_IMG_URL } from '@/constants/env';
import dayjs from '@/lib/dayjs';
import { commentService } from '@/services/comment-service';
import { CommentType } from '@/types/comment-type';
import { ChevronDown, Ellipsis, Loader2, Reply, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CommentProps {
  _comment: CommentType;
  setComments: Dispatch<SetStateAction<CommentType[]>>;
  isChild?: boolean;
  parentCommentId?: string;
  setParentCommentChildren?: Dispatch<SetStateAction<CommentType[]>>;
  fetchParentCommentChildren?: () => Promise<void> | void;
  setParentComment?: Dispatch<SetStateAction<CommentType>>;
  episodeNumber?: string | number | undefined;
}

export default function Comment({
  _comment,
  setComments,
  isChild = false,
  parentCommentId,
  setParentCommentChildren,
  fetchParentCommentChildren,
  episodeNumber,
}: CommentProps) {
  const [comment, setComment] = useState(_comment);
  const [isShowReplyForm, setIsShowReplyForm] = useState(false);
  const [isSpoil, setIsSpoil] = useState(_comment?.is_spoil);
  const [commentChildren, setCommentChildren] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenChildren, setIsOpenChildren] = useState(false);
  const [isFetchingChildrenFirstTime, setIsFetchingChildrenFirstTime] = useState(true);

  const handleToggleSpoil = () => {
    if (!isSpoil) return;
    setIsSpoil(false);
  };

  const fetchCommentChildren = async (): Promise<void> => {
    try {
      setIsOpenChildren(true);
      if (!isFetchingChildrenFirstTime) {
        return;
      }
      setLoading(true);
      const response = await commentService.getComments(
        comment?.movie_id,
        comment?.parent_id ? comment?.parent_id : comment?._id,
        episodeNumber,
      );
      setCommentChildren((response.data?.result as CommentType[]) || []);
      setIsFetchingChildrenFirstTime(false);
      setLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsOpenChildren(false);
      toast.error('Lỗi khi bình luận');
      return Promise.reject(error);
    }
  };

  const handleVoteComment = async (commentId: string, voteType: '0' | '1') => {
    const response = await commentService.voteComment(commentId, voteType);
    if (response.statusCode === 201 || response.statusCode === 200) {
      const newComment = response.data?.result?.[0] as CommentType;
      setComment((prev) => ({
        ...prev,
        total_dislike: newComment?.total_dislike,
        total_like: newComment?.total_like,
        is_dislike: newComment?.is_dislike,
        is_like: newComment?.is_like,
      }));
    }
  };

  return (
    <div className="flex gap-4">
      <Avatar className="size-[38px]">
        <AvatarImage src={`${RO_PHIM_IMG_URL}/${comment?.user_info?.avatar?.path}`} alt="@shadcn" />
        <AvatarFallback className="text-black">{comment?.user_info?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 h-fit">
          <span className="font-medium text-white">{comment?.user_info?.name}</span>
          <span className="text-[11px] text-[#aaa]">
            {comment?.createdAt ? dayjs(comment.createdAt).fromNow() : ''}
          </span>
          {comment?.episode_number !== null &&
            comment?.episode_number !== undefined &&
            comment?.episode_number !== 0 && (
              <span className="border border-[#fff5] rounded-sm py-[0.1rem] px-[0.4rem] text-[11px] text-[#aaa] h-fit">
                Tập {comment?.episode_number}
              </span>
            )}
        </div>
        <p
          className={`text-[#aaa] text-sm ${isSpoil ? 'blur cursor-pointer' : ''} transition-all`}
          onClick={handleToggleSpoil}
        >
          {comment?.content}
        </p>
        <div className="flex items-center gap-4 h-fit text-[#aaa] text-[11px] mt-2 select-none">
          <div
            className={`flex items-center gap-1 cursor-pointer hover:text-green-600 transition-all ${comment?.is_like ? 'text-green-600' : ''}`}
            onClick={() => handleVoteComment(comment._id, '1')}
          >
            <ThumbsUp size={13} strokeWidth={2} />
            <span>{comment?.total_like || ''}</span>
          </div>
          <div
            className={`flex items-center gap-1 cursor-pointer hover:text-red-600 transition-all ${comment?.is_dislike ? 'text-red-600' : ''}`}
            onClick={() => handleVoteComment(comment._id, '0')}
          >
            <ThumbsDown size={13} strokeWidth={2} />
            <span>{comment?.total_dislike || ''}</span>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-primary-color transition-all"
            onClick={() => setIsShowReplyForm(!isShowReplyForm)}
          >
            <Reply size={13} strokeWidth={2} />
            <span>Trả lời</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary-color transition-all">
            <Ellipsis size={13} strokeWidth={2} />
            <span>Thêm</span>
          </div>
        </div>
        {isShowReplyForm && (
          <div className="space-y-6 mt-4">
            <CommentForm
              type="reply"
              movieId={comment?.movie_id}
              parentId={parentCommentId || comment._id}
              mentionId={comment?.user_info?._id}
              episodeNumber={comment?.episode_number}
              setComments={setComments}
              setIsShowReplyForm={setIsShowReplyForm}
              setCommentChildren={setParentCommentChildren || setCommentChildren}
              fetchCommentChildren={fetchParentCommentChildren || fetchCommentChildren}
            />
          </div>
        )}
        {!isChild && comment?.total_children > 0 && (
          <Collapsible open={isOpenChildren} onOpenChange={setIsOpenChildren}>
            <CollapsibleTrigger>
              <p
                className="flex font-medium items-center gap-1 text-[12px] cursor-pointer text-primary-color transition-all mt-2 hover:opacity-80"
                onClick={() => fetchCommentChildren()}
              >
                <ChevronDown
                  size={13}
                  strokeWidth={3}
                  className={`transition-all ${isOpenChildren ? 'rotate-180' : ''}`}
                />
                <span>{comment.total_children} bình luận</span>
                {loading && <Loader2 size={13} strokeWidth={3} className="animate-spin" />}
              </p>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {commentChildren?.length > 0 && (
                <div className="space-y-6 mt-4">
                  {commentChildren.map((commentChild) => (
                    <Comment
                      key={commentChild._id}
                      _comment={commentChild}
                      setComments={setComments}
                      isChild={true}
                      parentCommentId={comment._id}
                      setParentCommentChildren={setCommentChildren}
                      fetchParentCommentChildren={fetchCommentChildren}
                      episodeNumber={episodeNumber}
                    />
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
