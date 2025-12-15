'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RATING_OPTIONS } from '@/constants/constants';
import { commentService } from '@/services/comment-service';
import { CreateCommentRequestBody, ReviewInfo } from '@/types/comment-type';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

type DialogReviewProps = {
  movieId: string;
  movieTitle?: string;
  rating?: number;
  reviewCount?: number;
  reviewInfo?: ReviewInfo;
  className?: string;
};

export default function DialogReview({
  movieId,
  movieTitle,
  rating,
  reviewCount,
  reviewInfo,
  className,
}: DialogReviewProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(reviewInfo?.point || null);
  const [contentReview, setContentReview] = useState(reviewInfo?.content || '');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!contentReview) {
      toast.error('Vui lòng nhập bình luận');
      return;
    }
    const commentRequestBody: CreateCommentRequestBody = {
      movie_id: movieId,
      parent_id: null,
      mention_id: null,
      content: contentReview,
      episode_number: null,
      is_spoil: false,
      is_review: true,
      point: selectedRating ? Number(selectedRating) : null,
    };

    try {
      setLoading(true);
      const response = await commentService.createComment(commentRequestBody);
      if (response.statusCode === 201 || response.statusCode === 200) {
        toast.success('Gửi đánh giá thành công');
        setContentReview('');
        setIsOpen(false);
      } else {
        toast.error('Lỗi khi gửi đánh giá');
      }
    } catch (error) {
      console.log({ error });
      toast.error('Lỗi khi gửi đánh giá');
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3556b6] cursor-pointer transition-colors ${className}`}
        >
          <Image src="https://www.rophim.li/images/ro-icon.svg" alt="Rating" width={20} height={20} />
          <span className="text-white font-semibold text-[16px] ">{rating?.toFixed(1) || '0.0'}</span>
          <span className="text-white underline text-xs">Đánh giá</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-full min-w-[600px] p-0 rounded-xl border-none gap-0 bg-[#1E2545] overflow-hidden"
        showCloseButton={true}
      >
        <div className="p-6 space-y-6">
          {/* Title */}
          <h2 className="text-white text-xl font-semibold text-center">{movieTitle}</h2>

          {/* Current Rating */}
          <div className="flex items-center justify-center gap-2 text-base">
            <Image src="https://www.rophim.li/images/ro-icon.svg" alt="Rating" width={20} height={20} />
            <span className="text-white font-bold">{rating?.toFixed(1) || '0.0'}</span>
            <span className="text-text-base">/ {reviewCount || 0} lượt đánh giá</span>
          </div>

          {/* Rating Options */}
          <div className="grid grid-cols-5 gap-3 bg-[#1d2236] rounded-lg p-8">
            {RATING_OPTIONS.map((option) => {
              const isSelected = selectedRating === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (reviewInfo) return;
                    setSelectedRating(option.value);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer select-none ${
                    isSelected ? 'bg-[#4784e7e0] scale-110' : 'bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  <span
                    className="text-2xl"
                    style={
                      isSelected
                        ? { filter: 'hue-rotate(0deg) saturate(1.5) brightness(1.1)' }
                        : { filter: 'grayscale(1) brightness(2) contrast(0.8)' }
                    }
                  >
                    <Image src={option.emoji_url} alt={option.label} width={80} height={80} />
                  </span>
                  <span
                    className={`text-xs text-center text-nowrap ${isSelected ? 'text-white font-semibold' : 'text-white'}`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <Textarea
              placeholder="Viết nhận xét về phim (tuỳ chọn)"
              value={contentReview}
              onChange={(e) => setContentReview(e.target.value)}
              disabled={!!reviewInfo}
              className="min-h-24 bg-[#282B3A] border-[#ffffff10] text-white placeholder:text-white placeholder:opacity-70 focus:border-[#ffd875] focus:ring-[#ffd875] rounded-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary-color text-black hover:bg-primary-color-hover font-semibold rounded-lg"
              disabled={!selectedRating || loading || !!reviewInfo}
            >
              <span className="flex items-center gap-4">
                Gửi đánh giá {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : ''}
              </span>
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-white text-gray-800 hover:bg-gray-100 font-semibold rounded-lg"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
