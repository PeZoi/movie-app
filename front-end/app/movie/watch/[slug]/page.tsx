'use client';

import Comment from '@/app/movie/watch/_components/comment';
import CommentForm from '@/app/movie/watch/_components/comment-form';
import EpisodeList from '@/app/movie/watch/_components/episode-list';
import MovieSuggestItem from '@/app/movie/watch/_components/movie-suggest-item';
import BadgeCategory from '@/components/badge-category';
import BadgeCustom from '@/components/badge-custom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AVATAR_DEFAULT } from '@/constants/constants';
import { IMAGE_TMDB_ORIGINAL, O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { movieService } from '@/services/movie-service';
import { MovieType } from '@/types/movie-type';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  Heart,
  LoaderCircle,
  MessageCircleMore,
  MessageSquareMore,
  Plus,
  Share,
  TextAlignStart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type EpisodeCurrent = {
  link_embed: string;
  episode: string;
};

export default function Index() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [episodeCurrent, setEpisodeCurrent] = useState<EpisodeCurrent | null>(null);
  const [actorFallbackMap, setActorFallbackMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!slug || !searchParams || !episodeCurrent?.episode) {
      return;
    }

    const currentEp = searchParams.get('ep');
    if (currentEp === episodeCurrent.episode) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('ep', episodeCurrent.episode);

    router.replace(`/movie/watch/${slug}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, slug, episodeCurrent?.episode]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await movieService.getMovieBySlug(slug as string);

        setMovie(response.data?.result || null);
        setEpisodeCurrent({
          link_embed: response.data?.result?.item?.episodes[0].server_data[0].link_embed || '',
          episode: response.data?.result?.item?.episodes[0].server_data[0].name || '',
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovie();
  }, [slug]);

  return (
    <div className="bg-bg-base">
      <div className="wrapper text-white">
        <div className="max-w-[1640px] mx-auto px-5">
          <h3 className="text-2xl font-bold flex items-center gap-5 mb-6 px-10">
            <div onClick={() => router.back()} className="border border-white rounded-full p-1 cursor-pointer">
              <ChevronLeft size={14} strokeWidth={3.5} />
            </div>
            Xem phim {movie?.item?.name}
          </h3>
          <div className="rounded-xl overflow-hidden">
            <div className="h-[900px]">
              <iframe src={episodeCurrent?.link_embed} frameBorder="0" className="w-full h-full"></iframe>
            </div>
            <div className="flex items-center justify-between bg-black p-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center p-[.6rem_.8rem] gap-2.5 cursor-pointer hover:text-primary-color-hover">
                  <Heart size={14} strokeWidth={3.5} />
                  <span className="text-sm">Yêu thích</span>
                </div>
                <div className="flex items-center p-[.6rem_.8rem] gap-2.5 cursor-pointer hover:text-primary-color-hover">
                  <Plus size={14} strokeWidth={3.5} />
                  <span className="text-sm">Danh sách</span>
                </div>
                <div className="flex items-center p-[.6rem_.8rem] gap-2.5 cursor-pointer hover:text-primary-color-hover">
                  <Share size={14} strokeWidth={3.5} />
                  <span className="text-sm">Chia sẻ</span>
                </div>
              </div>
              <div className="flex items-center p-[.6rem_.8rem] gap-2.5 cursor-pointer hover:text-primary-color-hover">
                <AlertCircle size={14} strokeWidth={3.5} />
                <span className="text-sm">Báo cáo</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 max-w-[1640px] mx-auto px-5">
          <div className="col-span-9 p-10">
            {/* Thông tin phim */}
            <div className="flex gap-6 border-b border-white/10 pb-10">
              <div className="w-[100px] shrink-0">
                <Image
                  src={O_PHIM_IMG_MOVIE_URL + movie?.item?.thumbUrl || ''}
                  alt={movie?.item?.name || ''}
                  width={100}
                  height={150}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="w-[440px] shrink-0">
                <h3 className="text-xl font-bold">{movie?.item?.name}</h3>
                <h5 className="text-sm text-primary-color my-4">{movie?.item?.originName}</h5>
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
                <div className="flex items-center gap-2 my-4">
                  {movie?.item.category.map((category) => (
                    <BadgeCategory key={category._id} category={category} />
                  ))}
                </div>
                {movie?.item.type === 'series' && (
                  <>
                    {movie.item.status === 'completed' && (
                      <div className="py-2 px-3 bg-[#22cb4c1a] text-[#22cb4c] flex items-center justify-center gap-2 w-fit rounded-full">
                        <BadgeCheck size={16} strokeWidth={2} />
                        <span className="text-xs">
                          Đã hoàn thành: {movie?.item?.episodeCurrent.replace('Tập ', '')} / {movie?.item?.episodeTotal}
                        </span>
                      </div>
                    )}
                    {movie.item.status === 'ongoing' && (
                      <div className="py-2 px-3 bg-[#ff83001a] text-[#ff8300] flex items-center justify-center gap-2 w-fit rounded-full">
                        <LoaderCircle size={16} strokeWidth={2} className="animate-spin" />
                        <span className="text-xs">
                          Đã chiếu: {movie?.item?.episodeCurrent.replace('Tập ', '')} / {movie?.item?.episodeTotal}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="grow pl-10">
                <p className="line-clamp-3 text-sm text-text-base leading-6">
                  {movie?.item?.description.replace('<p>', '').replace('</p>', '')}
                </p>
                <Link
                  href={'/movie/' + movie?.slug}
                  className="text-primary-color text-sm flex items-center gap-1 mt-3 hover:opacity-90"
                >
                  <span className="text-base">Thông tin phim</span>
                  <ArrowRight size={14} strokeWidth={3.5} />
                </Link>
              </div>
            </div>
            <div className="py-10 border-b border-white/10">
              <p className="text-2xl font-medium flex items-center gap-2">
                <TextAlignStart size={20} strokeWidth={3.5} className="text-primary-color" /> Danh sách tập phim
              </p>
              {/* Danh sách tập phim */}
              <EpisodeList episodes={movie?.item?.episodes || []} setEpisodeCurrent={setEpisodeCurrent} />
            </div>
            <div className="py-10">
              <p className="text-2xl font-medium flex items-center gap-2">
                <MessageCircleMore size={20} strokeWidth={3} className="text-primary-color" /> Bình luận
              </p>

              {/* Form bình luận */}
              <CommentForm />

              {/* Danh sách bình luận */}
              <div className="mt-10 bg-[#272932] rounded-lg py-13 flex flex-col items-center justify-center gap-2 text-[#aaa]">
                <MessageSquareMore size={30} strokeWidth={2} />
                <p className="text-base font-medium">Chưa có bình luận nào</p>
              </div>
              <div className="mt-4 space-y-6">
                <Comment hasChildren={true} />
                <Comment hasChildren={true} />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="h-full border-l border-white/10 p-10">
              <p className="text-2xl font-medium flex items-center gap-2">Diễn viên</p>
              <div className="grid grid-cols-3 place-items-center mt-5 gap-4 border-white/10 border-b pb-10 mb-10">
                {movie?.item.actor.map((actor) => {
                  const shouldUseFallback = actorFallbackMap[actor.actor_id] || !actor.profile_path;
                  const avatarSrc = shouldUseFallback ? AVATAR_DEFAULT : `${IMAGE_TMDB_ORIGINAL}/${actor.profile_path}`;

                  return (
                    <Link
                      href={'/author/' + actor.actor_id}
                      className="flex flex-col items-center justify-center gap-2"
                      key={actor.actor_id}
                    >
                      <Avatar className="size-20">
                        <AvatarImage
                          src={avatarSrc}
                          className="object-cover"
                          onError={() =>
                            setActorFallbackMap((prev) => ({
                              ...prev,
                              [actor.actor_id]: true,
                            }))
                          }
                        />
                      </Avatar>
                      <p className="text-sm text-wrap text-center">{actor.name}</p>
                    </Link>
                  );
                })}
              </div>
              <p className="text-2xl font-medium flex items-center gap-2">Đề xuất cho bạn</p>
              <div className="mt-5">
                <MovieSuggestItem />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
