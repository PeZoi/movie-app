'use client';

import FilterForm from '@/components/filter-form';
import HoverCardMovie from '@/components/hover-card-movie';
import { O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { movieService } from '@/services/movie-service';
import { useGlobalStore } from '@/store';
import { MovieType } from '@/types/movie-type';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FilterPage() {
  const searchParam = useSearchParams();
  const type = searchParam.get('type');
  const categories = searchParam.get('categories');
  const countries = searchParam.get('countries');
  const years = searchParam.get('years');
  const sort = searchParam.get('sort');
  const [movieList, setMovieList] = useState<MovieType[]>([]);
  const { getNameCountryBySlug, getNameCategoryBySlug } = useGlobalStore();

  useEffect(() => {
    const fetchMovieList = async () => {
      const response = await movieService.getMoviesByFilter(
        type as string,
        categories as string,
        countries as string,
        years as string,
        sort as string,
      );
      if (response.statusCode === 200) {
        setMovieList(response.data?.result || []);
      }
    };
    fetchMovieList();
  }, [type, categories, countries, years, sort]);

  return (
    <div className="bg-bg-base min-h-screen">
      <div className="wrapper">
        <div className="max-w-[1900px] mx-auto px-5">
          <div className="mt-10 mb-6">
            {searchParam.size === 1 &&
              (categories && categories.split(',').length === 1 ? (
                <h1 className="text-white font-bold text-3xl">Phim {getNameCategoryBySlug(categories as string)}</h1>
              ) : countries && countries.split(',').length === 1 ? (
                <h1 className="text-white font-bold text-3xl">Phim {getNameCountryBySlug(countries as string)}</h1>
              ) : type === 'single' ? (
                <h1 className="text-white font-bold text-3xl">Phim lẻ</h1>
              ) : type === 'series' ? (
                <h1 className="text-white font-bold text-3xl">Phim bộ</h1>
              ) : (
                <h1 className="text-white font-bold text-3xl">Duyệt phim</h1>
              ))}
            {searchParam.size > 1 && <h1 className="text-white font-bold text-3xl">Kết quả tìm kiếm</h1>}
          </div>

          {/* Bộ lọc phim - Collapse */}
          <div className="mb-8">
            <FilterForm />
          </div>

          {/* Danh sách phim */}
          <div className="grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-7">
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
