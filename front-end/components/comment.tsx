import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Ellipsis, Reply, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';

interface CommentProps {
  hasChildren?: boolean;
}

export default function Comment({ hasChildren = false }: CommentProps) {
  return (
    <div className="flex gap-4">
      <Avatar className="size-[50px]">
        <AvatarImage
          src="https://www.rophim.li/images/avatars/pack6/03.jpg"
          alt="Avatar"
          width={50}
          height={50}
          className="object-cover"
        />
        <AvatarFallback>N</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 h-fit">
          <span className="font-medium text-white">Đông</span>
          <span className="text-[11px] text-[#aaa]">3 ngày trước</span>
          <span className="border border-[#fff5] rounded-sm py-[0.1rem] px-[0.4rem] text-[11px] text-[#aaa] h-fit">
            Tập 1
          </span>
        </div>
        <p className="text-[#aaa] text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        <div className="flex items-center gap-4 h-fit text-[#aaa] text-[11px] mt-2 select-none">
          <div className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-all">
            <ThumbsUp size={13} strokeWidth={2} />
            <span>1</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-red-600 transition-all">
            <ThumbsDown size={13} strokeWidth={2} />
            <span>2</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary-color transition-all">
            <Reply size={13} strokeWidth={2} />
            <span>Trả lời</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary-color transition-all">
            <Ellipsis size={13} strokeWidth={2} />
            <span>Thêm</span>
          </div>
        </div>

        {hasChildren && (
          <div className="space-y-6 mt-6">
            <Comment />
            <Comment />
          </div>
        )}
      </div>
    </div>
  );
}
