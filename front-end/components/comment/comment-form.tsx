'use client';

import DialogAuth from '@/components/dialog-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RO_PHIM_IMG_URL } from '@/constants/env';
import { commentService } from '@/services/comment-service';
import { useAuthStore } from '@/store';
import { CommentType, CreateCommentRequestBody } from '@/types/comment-type';
import { Loader2, Send } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

type CommentFormProps = {
  type: 'comment' | 'reply';
  movieId: string;
  parentId?: string;
  mentionId?: string;
  episodeNumber?: string | number | undefined;
  setComments: Dispatch<SetStateAction<CommentType[]>>;
  setIsShowReplyForm?: (isShowReplyForm: boolean) => void;
  setCommentChildren?: Dispatch<SetStateAction<CommentType[]>>;
  fetchCommentChildren?: () => Promise<void> | void;
};

export default function CommentForm({
  type = 'comment',
  movieId,
  parentId,
  mentionId,
  episodeNumber,
  setComments,
  setIsShowReplyForm,
  setCommentChildren,
  fetchCommentChildren,
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [isSpoil, setIsSpoil] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content) {
      toast.error('Vui lòng nhập bình luận');
      return;
    }
    const commentRequestBody: CreateCommentRequestBody = {
      movie_id: movieId,
      parent_id: parentId || null,
      mention_id: mentionId || null,
      content: content,
      episode_number: episodeNumber ? Number(episodeNumber) : null,
      is_spoil: isSpoil,
    };

    try {
      setLoading(true);
      const response = await commentService.createComment(commentRequestBody);
      if (response.statusCode === 201 || response.statusCode === 200) {
        const newComment = response.data?.result as CommentType;
        toast.success('Gửi bình luận thành công');
        setContent('');
        setIsSpoil(false);
        if (setIsShowReplyForm) {
          setIsShowReplyForm(false);
        }
        if (setCommentChildren && fetchCommentChildren) {
          setCommentChildren((prev) => [...(prev || []), newComment]);
          await fetchCommentChildren?.();
        }
        if (setComments) {
          if (type === 'comment') setComments((prev) => [newComment, ...(prev || [])]);
          if (type === 'reply') {
            setComments((prev) => {
              const comment = prev?.find((comment) => comment._id === parentId);
              if (comment) {
                comment.total_children++;
              }
              return prev;
            });
          }
        }
      } else {
        toast.error('Lỗi khi gửi bình luận');
      }
    } catch (error) {
      console.log({ error });
      toast.error('Lỗi khi gửi bình luận');
      return;
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {type === 'comment' &&
        (user ? (
          <div className="flex items-center gap-2 mt-4">
            <Avatar className="size-[38px]">
              <AvatarImage src={`${RO_PHIM_IMG_URL}/${user?.avatar?.path}`} alt="@shadcn" />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-text-base">Bình luận với tên</p>
              <p className="text-base text-white font-medium">{user?.name}</p>
            </div>
          </div>
        ) : (
          <p className="text-base text-text-base mt-4 space-x-1">
            <span>Vui lòng</span>
            <DialogAuth>
              <span className="text-primary-color cursor-pointer">đăng nhập</span>
            </DialogAuth>
            <span>để bình luận</span>
          </p>
        ))}
      <div className={`bg-[#272932] rounded-lg p-4 ${type === 'reply' ? 'min-w-[500px]' : 'mt-4'}`}>
        <Textarea
          placeholder="Nhập bình luận của bạn"
          className="border-none min-h-[120px] bg-bg-base text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              className="bg-bg-base data-[state=unchecked]:bg-bg-base data-[state=checked]:bg-primary-color cursor-pointer"
              checked={isSpoil}
              onCheckedChange={setIsSpoil}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="airplane-mode" className="text-xs text-text-base">
                  Tiết lộ?
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Đây có phải là bình luận tiết lộ nội dung phim không? (Spoiler)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {user ? (
            <button
              className="mt-4 flex items-center gap-2 font-medium text-primary-color cursor-pointer hover:opacity-80 transition-all"
              onClick={() => handleSubmit()}
            >
              <Send size={16} strokeWidth={3.5} />
              <span>
                {loading ? <Loader2 size={16} strokeWidth={3.5} className="animate-spin text-primary-color" /> : 'Gửi'}
              </span>
            </button>
          ) : (
            <DialogAuth>
              <button className="mt-4 flex items-center gap-2 font-medium text-primary-color cursor-pointer hover:opacity-80 transition-all">
                <Send size={16} strokeWidth={3.5} />
                <span>Gửi</span>
              </button>
            </DialogAuth>
          )}
        </div>
      </div>
    </>
  );
}
