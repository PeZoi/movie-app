'use client';

import DialogAuth from '@/components/dialog-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RO_PHIM_IMG_URL } from '@/constants/env';
import { useAuthStore } from '@/store';
import { Send } from 'lucide-react';

export default function CommentForm() {
  const { user } = useAuthStore();
  return (
    <>
      {user ? (
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
      )}
      <div className="mt-4 bg-[#272932] rounded-lg p-4">
        <Textarea placeholder="Nhập bình luận của bạn" className="border-none min-h-[120px] bg-bg-base" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mt-4">
            <Switch className="bg-bg-base data-[state=unchecked]:bg-bg-base data-[state=checked]:bg-primary-color cursor-pointer" />
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
              onClick={() => {
                alert('Gửi bình luận');
              }}
            >
              <Send size={16} strokeWidth={3.5} />
              <span>Gửi</span>
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
