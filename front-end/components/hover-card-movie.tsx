import BadgeCategory from '@/components/badge-category';
import BadgeCustom from '@/components/badge-custom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Heart, Info, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type HoverCardMovieProps = {
  children: React.ReactNode;
  data: { id: number; name_vi: string; name_en: string; image: string; image_hover: string; categories: string[] };
};

export default function HoverCardMovie({ children, data }: HoverCardMovieProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="max-w-[450px] w-fit p-0 overflow-hidden rounded-2xl" side="right">
        <div className="bg-[#2f3446]">
          <div className="w-full h-[250px] mask-image-top-down">
            <Image
              src={data.image_hover}
              alt={data.name_vi}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 flex flex-col gap-3.5">
            <div>
              <p className="font-medium text-white text-lg">{data.name_vi}</p>
              <p className="text-base text-primary-color">{data.name_en}</p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-nowrap">
              <Link
                href={`/movie/${data.id}`}
                className="w-fit h-[38px] text-sm text-black flex items-center gap-2 bg-primary-color-gradient px-8 rounded-sm justify-center hover:opacity-90"
              >
                <Play size={18} strokeWidth={3} />
                <span className="text-base font-bold text-nowrap">Xem ngay</span>
              </Link>
              <Link
                href={`/movie/${data.id}`}
                className="w-fit h-[38px] text-sm text-white flex items-center gap-2 px-5 rounded-sm justify-center border border-white hover:opacity-90"
              >
                <Heart size={16} strokeWidth={3} />
                <span className="text-base font-medium text-nowrap">Thích</span>
              </Link>
              <Link
                href={`/movie/${data.id}`}
                className="w-fit h-[38px] text-sm text-white flex items-center gap-2 px-5 rounded-sm justify-center border border-white hover:opacity-90"
              >
                <Info size={16} strokeWidth={3} />
                <span className="text-base font-medium text-nowrap">Chi tiết</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCustom variant="imdb" className="font-medium">
                6.6
              </BadgeCustom>
              <BadgeCustom variant="filled" className="font-bold">
                T18
              </BadgeCustom>
              <BadgeCustom variant="outline">2012</BadgeCustom>
              <BadgeCustom variant="outline">Phần 4</BadgeCustom>
              <BadgeCustom variant="outline">Tập 25</BadgeCustom>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <BadgeCategory key={category} category={category} />
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
