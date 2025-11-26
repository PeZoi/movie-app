import HoverCardMovie from '@/components/hover-card-movie';
import { O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { CollectionType } from '@/types/collection-type';
import { MovieType } from '@/types/movie-type';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

type CollectionProps = {
  collection: CollectionType;
};

export default function Collection({ collection }: CollectionProps) {
  return (
    <div>
      <h2
        className="text-3xl font-medium"
        style={{
          background: 'linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(103, 65, 150) 130%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'inline-block',
        }}
      >
        {collection.name}
      </h2>
      <div className="overflow-hidden mt-10">
        <Swiper slidesPerView={8} spaceBetween={10}>
          {collection.movies.map((movie: MovieType) => (
            <SwiperSlide key={movie._id}>
              <div>
                <HoverCardMovie movie={movie}>
                  <Link href={`/movie/watch/${movie.slug}`} className="block group">
                    <div className="relative w-full" style={{ aspectRatio: '2 / 3' }}>
                      <Image
                        src={`${O_PHIM_IMG_MOVIE_URL}${movie.item.thumbUrl}`}
                        alt={movie.item.name}
                        fill
                        sizes="(max-width: 768px) 40vw, 180px"
                        className="object-cover rounded-xl w-full h-full transition-opacity duration-300 group-hover:opacity-80"
                      />
                    </div>
                  </Link>
                </HoverCardMovie>
                <div className="text-center mt-3 h-fit">
                  <Link
                    href={`/movie/watch/${movie.slug}`}
                    className="block text-white text-base hover:text-primary-color transition-all duration-300 truncate"
                  >
                    {movie.item.name}
                  </Link>
                  <Link href={`/movie/watch/${movie.slug}`} className="block text-gray-500 text-sm truncate">
                    {movie.item.originName}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
