'use client';

import HoverCardMovie from '@/components/hover-card-movie';
import { O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { movieService } from '@/services/movie-service';
import { useGlobalStore } from '@/store';
import { MovieType } from '@/types/movie-type';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CountryPage() {
  const { slug } = useParams();
  const [movieList, setMovieList] = useState<MovieType[]>([]);
  const { getNameCountryBySlug } = useGlobalStore();

  useEffect(() => {
    const fetchMovieList = async () => {
      const response = await movieService.getMoviesByCountry(slug as string, 1, 32);
      if (response.statusCode === 200) {
        setMovieList(response.data?.result || []);
      }
    };
    fetchMovieList();
  }, [slug]);

  return (
    <div className="bg-bg-base min-h-screen">
      <div className="wrapper">
        <div className="max-w-[1900px] mx-auto px-5">
          <h1 className="text-white font-bold text-3xl">Phim {getNameCountryBySlug(slug as string)}</h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-7 mt-10">
            {movieList?.map((movie: MovieType) => (
              <div key={movie._id}>
                <HoverCardMovie movie={movie}>
                  <Link href={`/movie/watch/${movie.slug}`} className="block group">
                    <div className="relative w-full" style={{ aspectRatio: '2 / 3' }}>
                      <Image
                        src={`${O_PHIM_IMG_MOVIE_URL}${movie.item.thumbUrl}`}
                        alt={movie.item.name}
                        width={200}
                        height={300}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
