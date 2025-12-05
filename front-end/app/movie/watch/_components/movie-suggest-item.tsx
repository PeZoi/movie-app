import { O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { MovieType } from '@/types/movie-type';
import Image from 'next/image';
import Link from 'next/link';

type MovieSuggestItemProps = {
  movie: MovieType;
};

export default function MovieSuggestItem({ movie }: MovieSuggestItemProps) {
  return (
    <div className="flex w-full rounded-lg overflow-hidden bg-[#ffffff05]">
      <Link href={`/movie/watch/${movie?.slug}`} className="block">
        <Image
          src={`${O_PHIM_IMG_MOVIE_URL}${movie?.item?.thumbUrl}`}
          alt={movie?.item?.name || ''}
          width={80}
          height={120}
          className="object-cover rounded-lg"
        />
      </Link>
      <div className="py-2.5 px-3 mt-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <Link href={`/movie/watch/${movie?.slug}`} className="block">
            <p className="text-base text-white font-medium hover:text-primary-color transition-all duration-300">
              {movie?.item?.name}
            </p>
          </Link>
          <p className="text-sm text-[#aaa]">{movie?.item?.originName}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#aaa]">
          <span>{movie?.item?.quality}</span>
          <span>•</span>
          <span>{movie?.item?.year}</span>
          <span>•</span>
          <span>{movie?.item?.time}</span>
        </div>
      </div>
    </div>
  );
}
