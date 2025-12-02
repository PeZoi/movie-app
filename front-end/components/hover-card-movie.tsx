import BadgeCategory from '@/components/badge-category';
import BadgeCustom from '@/components/badge-custom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { MovieType } from '@/types/movie-type';
import { Heart, Info, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type HoverCardMovieProps = {
  children: React.ReactNode;
  movie: MovieType;
};

export default function HoverCardMovie({ children, movie }: HoverCardMovieProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="max-w-[450px] w-fit p-0 overflow-hidden rounded-2xl" side="right">
        <div className="bg-[#2f3446]">
          <div className="w-full h-[250px] mask-image-top-down">
            <Image
              src={
                movie?.images
                  ? movie?.images?.[0]?.image_sizes?.backdrop?.original + movie?.images?.[0]?.image?.file_path
                  : movie?.item?.images?.[0]?.image_sizes?.backdrop?.original +
                    movie?.item?.images?.[0]?.images?.[0]?.file_path
              }
              alt={movie?.item?.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 flex flex-col gap-3.5">
            <div>
              <p className="font-medium text-white text-lg">{movie?.item?.name}</p>
              <p className="text-base text-primary-color">{movie?.item?.originName}</p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-nowrap">
              <Link
                href={`/movie/watch/${movie?.slug}`}
                className="w-fit h-[38px] text-sm text-black flex items-center gap-2 bg-primary-color-gradient px-8 rounded-sm justify-center hover:opacity-90"
              >
                <Play size={18} strokeWidth={3} />
                <span className="text-base font-bold text-nowrap">Xem ngay</span>
              </Link>
              <Link
                href={`/movie/${movie?.slug}`}
                className="w-fit h-[38px] text-sm text-white flex items-center gap-2 px-5 rounded-sm justify-center border border-white hover:opacity-90"
              >
                <Heart size={16} strokeWidth={3} />
                <span className="text-base font-medium text-nowrap">Thích</span>
              </Link>
              <Link
                href={`/movie/${movie?.slug}`}
                className="w-fit h-[38px] text-sm text-white flex items-center gap-2 px-5 rounded-sm justify-center border border-white hover:opacity-90"
              >
                <Info size={16} strokeWidth={3} />
                <span className="text-base font-medium text-nowrap">Chi tiết</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCustom variant="imdb" className="font-medium">
                {movie?.item?.imdb?.vote_average}
              </BadgeCustom>
              {/* <BadgeCustom variant="filled" className="font-bold">
                T18
              </BadgeCustom> */}
              <BadgeCustom variant="outline">{movie?.item?.year}</BadgeCustom>
              <BadgeCustom variant="outline">{movie?.item?.quality}</BadgeCustom>
              <BadgeCustom variant="outline">{movie?.item?.episodeTotal}</BadgeCustom>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie?.category?.map((category, index) => (
                <BadgeCategory key={category?._id || category?.slug || `category-${index}`} category={category} />
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
