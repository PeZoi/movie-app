'use client';

import Comment from '@/components/comment';
import CommentForm from '@/components/comment-form';
import EpisodeList from '@/app/movie/watch/_components/episode-list';
import MovieSuggestItem from '@/app/movie/watch/_components/movie-suggest-item';
import AvatarList from '@/components/avatar-list';
import BadgeCategory from '@/components/badge-category';
import BadgeCustom from '@/components/badge-custom';
import { O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
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
import { useEffect, useMemo, useState } from 'react';

export type EpisodeCurrent = {
  link_embed: string;
  episode: string;
};

export default function WatchMoviePage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [moviesSuggestion, setMoviesSuggestion] = useState<MovieType[]>([]);
  const [episodeCurrent, setEpisodeCurrent] = useState<EpisodeCurrent | null>(null);
  const ep = searchParams.get('ep') || '';

  // Lấy thông tin phim + tập hiện tại, đồng thời đảm bảo URL luôn có ?ep=
  useEffect(() => {
    if (!slug) return;

    const fetchMovie = async () => {
      try {
        const response = await movieService.getMovieBySlug(slug as string);
        const data = response.data?.result?.[0] as MovieType | null;

        if (!data) {
          setMovie(null);
          setEpisodeCurrent(null);
          return;
        }

        const episodes = data?.item?.episodes?.[0]?.server_data;

        if (!episodes.length) {
          setMovie(data);
          setEpisodeCurrent(null);
          return;
        }

        const defaultEpName = episodes[0]?.name || '';
        let currentEpName = ep || defaultEpName;
        if (Number.isNaN(parseInt(currentEpName)) || parseInt(currentEpName) <= 0) {
          currentEpName = defaultEpName;
          const params = new URLSearchParams(searchParams.toString());
          params.set('ep', currentEpName);
          router.replace(`/movie/watch/${slug}?${params.toString()}`, { scroll: false });
        }
        const currentEp = episodes.find((episode) => episode.name === currentEpName);

        if (!defaultEpName) router.replace(`/movie/${slug}`, { scroll: false });

        // Nếu URL chưa có ?ep= thì set mặc định là tập đầu tiên
        if (!ep && currentEpName) {
          const params = new URLSearchParams(searchParams.toString());
          params.set('ep', currentEpName);
          router.replace(`/movie/watch/${slug}?${params.toString()}`, { scroll: false });
        }

        setMovie(data);
        setEpisodeCurrent(
          currentEp
            ? {
                link_embed: currentEp.link_embed,
                episode: currentEp.name,
              }
            : null,
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovie();
  }, [slug, ep, router, searchParams]);

  // Tính sẵn category slug cho API gợi ý phim
  const suggestionCategories = useMemo(
    () => movie?.item?.category.map((category) => category.slug).join(',') || '',
    [movie?.item?.category],
  );

  // Gọi API gợi ý phim, chỉ chạy khi đã có category
  useEffect(() => {
    if (!suggestionCategories) return;

    const fetchMoviesSuggestion = async () => {
      try {
        const response = await movieService.getMoviesSuggestion(suggestionCategories);
        setMoviesSuggestion(response.data?.result || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoviesSuggestion();
  }, [suggestionCategories]);

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
                  {movie?.item?.category?.map((category) => (
                    <BadgeCategory key={category._id} category={category} />
                  ))}
                </div>
                {movie?.item?.type === 'series' && (
                  <>
                    {movie.item?.status === 'completed' && (
                      <div className="py-2 px-3 bg-[#22cb4c1a] text-[#22cb4c] flex items-center justify-center gap-2 w-fit rounded-full">
                        <BadgeCheck size={16} strokeWidth={2} />
                        <span className="text-xs">
                          Đã hoàn thành: {movie?.item?.episodeCurrent.replace('Tập ', '')} / {movie?.item?.episodeTotal}
                        </span>
                      </div>
                    )}
                    {movie.item?.status === 'ongoing' && (
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
                  {movie?.item?.description.replaceAll('<p>', ' ').replaceAll('</p>', ' ')}
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
                <AvatarList actors={movie?.item?.actor || []} />
              </div>
              <p className="text-2xl font-medium flex items-center gap-2">Đề xuất cho bạn</p>
              <div className="mt-5 space-y-6">
                {moviesSuggestion.map((movie) => (
                  <MovieSuggestItem key={movie._id || movie.slug} movie={movie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
