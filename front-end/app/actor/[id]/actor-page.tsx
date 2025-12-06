'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ActorType } from '@/types/actor-type';
import { MovieType } from '@/types/movie-type';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HoverCardMovie from '@/components/hover-card-movie';
import PaginationComponent from '@/components/pagination';
import { AVATAR_DEFAULT } from '@/constants/constants';
import { IMAGE_TMDB_ORIGINAL, O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { actorService } from '@/services/actor-service';
import { movieService } from '@/services/movie-service';

export default function ActorPage() {
  const pageSize = '20';
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageParam = searchParams.get('page') || '1';
  const [actor, setActor] = useState<ActorType | null>(null);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async (actorId: string) => {
      try {
        setUseFallback(false); // Reset fallback when fetching new actor
        const responseActor = await actorService.getActorById(actorId);
        setActor(responseActor.data?.result?.[0] as ActorType | null);
        const responseMovies = await movieService.getMoviesByActorId(actorId, currentPageParam, pageSize);
        setMovies(responseMovies.data?.result || []);
        setTotalPages(responseMovies.data?.totalPages || 0);
        setTotalItems(responseMovies.data?.totalItems || 0);
      } catch (error) {
        console.error('Error fetching actor:', error);
      }
    };

    fetchData(id as string);
  }, [id, currentPageParam, pageSize]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/actor/${id}?${params.toString()}`);
  };

  const shouldUseFallback = useFallback || !actor?.profile_path;
  const avatarSrc = shouldUseFallback ? AVATAR_DEFAULT : `${IMAGE_TMDB_ORIGINAL}${actor.profile_path}`;

  return (
    <div className="bg-bg-base h-screen">
      <div className="wrapper">
        <div className="max-w-[1640px] mx-auto px-5">
          {/* Main Content - Side by Side Layout */}
          <div className="grid grid-cols-12 gap-6 mb-10">
            {/* Left Side - Actor Info */}
            <div className="col-span-3 pr-6 border-r border-white/10">
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex">
                  <Avatar className="size-[160px] rounded-4xl overflow-hidden">
                    <AvatarImage
                      src={avatarSrc}
                      alt={actor?.name}
                      className="object-cover w-full h-full"
                      onError={() => setUseFallback(true)}
                    />
                  </Avatar>
                </div>

                {/* Actor Details */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white">{actor?.name || 'Tên diễn viên'}</h2>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#aaa] min-w-[120px]">Ngày sinh:</span>
                      <span className="text-white italic">Đang cập nhật</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#aaa] min-w-[120px]">Quốc gia:</span>
                      <span className="text-white italic">Đang cập nhật</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#aaa] min-w-[120px]">Giới tính:</span>
                      <span className="text-white">{actor?.gender_name === 'Male' ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#aaa] min-w-[120px]">Nghề nghiệp:</span>
                      <span className="text-white">
                        {actor?.known_for_department === 'Acting' ? 'Diễn viên' : actor?.known_for_department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Movies Section */}
            <div className="col-span-8 pl-6">
              <h2 className="text-2xl font-bold text-white mb-6">Các phim đã tham gia</h2>
              {loading ? (
                <div className="text-white text-center py-10">Đang tải...</div>
              ) : movies.length > 0 ? (
                <>
                  <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
                    {movies.map((movie: MovieType, index: number) => (
                      <div key={movie._id || movie.slug || `movie-${index}`}>
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
                  {totalPages > 1 && (
                    <div className="mx-auto w-full flex justify-center mt-14">
                      <PaginationComponent
                        page={parseInt(currentPageParam) || 1}
                        pageSize={parseInt(pageSize)}
                        total={totalItems}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white text-center py-10">Chưa có phim nào</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
