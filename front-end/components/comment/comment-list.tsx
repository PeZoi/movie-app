'use client';

import Comment from '@/components/comment/comment';
import CommentForm from '@/components/comment/comment-form';
import { commentService } from '@/services/comment-service';
import { CommentType } from '@/types/comment-type';
import { Loader2, MessageSquareMore } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type CommentListProps = {
  movieId: string;
  episodeNumber?: string | number | undefined;
};

export default function CommentList({ movieId, episodeNumber }: CommentListProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const response = await commentService.getComments(movieId, undefined, episodeNumber);
    setIsLoading(false);
    setComments((response.data?.result as CommentType[]) || []);
  }, [movieId, episodeNumber]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchComments();
  }, [movieId, episodeNumber, fetchComments]);
  return (
    <>
      <CommentForm movieId={movieId} type="comment" setComments={setComments} episodeNumber={episodeNumber} />

      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader2 strokeWidth={3} className="size-4 animate-spin text-primary-color" />
        </div>
      ) : comments.length === 0 ? (
        <div className="mt-10 bg-[#272932] rounded-lg py-13 flex flex-col items-center justify-center gap-2 text-[#aaa]">
          <MessageSquareMore size={30} strokeWidth={2} />
          <p className="text-base font-medium">Chưa có bình luận nào</p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {comments.map((comment) => (
            <Comment key={comment._id} _comment={comment} setComments={setComments} episodeNumber={episodeNumber} />
          ))}
        </div>
      )}
    </>
  );
}
