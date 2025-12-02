import MovieSuggestItem from '@/app/movie/watch/_components/movie-suggest-item';
import AvatarList from '@/components/avatar-list';
import BadgeCategory from '@/components/badge-category';
import BadgeCustom from '@/components/badge-custom';
import Comment from '@/components/comment';
import CommentForm from '@/components/comment-form';
import HoverCardMovie from '@/components/hover-card-movie';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IMAGE_TMDB_ORIGINAL, O_PHIM_IMG_MOVIE_URL } from '@/constants/env';
import { movieService } from '@/services/movie-service';
import { MovieType } from '@/types/movie-type';
import { BadgeCheck, Heart, LoaderCircle, MessageSquareMore, Play, Plus, Share, TextAlignStart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function MovieDetailPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = await params;

  let movie: MovieType;
  try {
    const response = await movieService.getMovieBySlug(slug as string);
    if (response.statusCode === 200 && response.data?.result) {
      movie = response.data.result as MovieType;
      console.log(movie?.item?.images?.[0]?.images);
    } else {
      notFound();
    }
  } catch (error) {
    console.error('Error fetchingd movie:', error);
    notFound();
  }

  return (
    <div className="bg-bg-base">
      <div className="pb-[30%] h-0 relative">
        <div className="mask-image-top-down absolute inset-0 max-w-[1900px] mx-auto">
          <div
            style={{
              backgroundImage: `url("${movie?.item?.images?.[0]?.image_sizes?.backdrop?.original + movie?.item?.images?.[0]?.images?.[0]?.file_path}")`,
            }}
            className="absolute top-0 left-0 right-0 bottom-0 opacity-60 bg-cover bg-center mask-image-right-left"
          ></div>
        </div>
      </div>
      <div className="wrapper">
        <div className="mt-[-190px] max-w-[1640px] px-4 mx-auto relative z-3 flex justify-between items-stretch">
          <div className="shrink-0 w-[440px] p-10 flex flex-col rounded-[1.25_3rem_1.25_1.25rem] bg-bg-base">
            <Image
              src={`${O_PHIM_IMG_MOVIE_URL}${movie.item.thumbUrl}`}
              alt={movie.item.name}
              width={160}
              height={240}
              className="rounded-lg object-cover mb-8"
            />
            <h2 className="font-bold text-2xl mb-4 text-white">{movie.item.name}</h2>
            <p className="text-primary-color text-sm mb-8">{movie.item.originName}</p>
            <div className="flex items-center gap-2 mb-3">
              <BadgeCustom variant="imdb" className="font-medium">
                {movie?.item?.imdb?.vote_average}
              </BadgeCustom>
              <BadgeCustom variant="outline">{movie?.item?.year}</BadgeCustom>
              <BadgeCustom variant="outline">{movie?.item?.quality}</BadgeCustom>
              <BadgeCustom variant="outline">{movie?.item?.episodeTotal}</BadgeCustom>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {movie?.item?.category?.map((category, index) => (
                <BadgeCategory key={category?._id || category?.slug || `category-${index}`} category={category} />
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
            <div className="flex flex-col gap-3 text-base mt-4">
              <div className="space-y-2">
                <div className="text-white font-medium">Giới thiệu: </div>
                <p className="text-text-base">
                  {movie?.item?.description?.replaceAll('<p>', ' ').replaceAll('</p>', ' ').replaceAll('<br>', '\n')}
                </p>
              </div>
              <div className="space-x-2">
                <span className="text-white font-medium">Thời lượng:</span>
                <span className="text-text-base">{movie?.item?.time}</span>
              </div>
              <div className="space-x-2">
                <span className="text-white font-medium">Quốc gia:</span>
                <span className="text-text-base">
                  {movie?.item?.country?.map((country) => country?.name).join(', ')}
                </span>
              </div>
              <div className="space-x-2">
                <span className="text-white font-medium">Năm phát hành:</span>
                <span className="text-text-base">{movie?.item?.year}</span>
              </div>
            </div>
            <Separator className="my-6 bg-border-color" />
            <div>
              <p className="text-white font-medium text-xl">Diễn viên</p>
              <div className="grid grid-cols-3 place-items-center mt-5 gap-4">
                <AvatarList actors={movie?.item?.actor || []} />
              </div>
            </div>
            <Separator className="my-6 bg-border-color" />
            <div id="demo">
              <p className="text-white font-medium text-xl">Đề xuất cho bạn</p>
              <div className="space-y-4 mt-5">
                <MovieSuggestItem />
              </div>
            </div>
          </div>
          <div className="flex-1 p-10 flex flex-col rounded-[3rem_1.25rem_1.25rem_1.25rem] bg-bg-base">
            <div className="flex items-center gap-12">
              <Link
                href={`/movie/watch/${movie?.slug}`}
                className="w-fit h-[60px] text-sm text-black flex items-center gap-2 bg-primary-color-gradient px-8 rounded-full justify-center hover:opacity-90 shadow-primary"
              >
                <Play size={18} strokeWidth={3} />
                <span className="text-lg font-bold text-nowrap">Xem ngay</span>
              </Link>
              <div className="flex items-center gap-5">
                <div className="flex flex-col justify-center items-center p-[.6rem] gap-1.5 hover:bg-bg-base-2 rounded-lg min-w-[80px] cursor-pointer hover:text-primary-color-hover text-white">
                  <Heart size={14} strokeWidth={3.5} />
                  <span className="text-sm">Yêu thích</span>
                </div>
                <div className="flex flex-col justify-center items-center p-[.6rem] gap-1.5 hover:bg-bg-base-2 rounded-lg min-w-[80px] cursor-pointer hover:text-primary-color-hover text-white">
                  <Plus size={14} strokeWidth={3.5} />
                  <span className="text-sm">Danh sách</span>
                </div>
                <div className="flex flex-col justify-center items-center p-[.6rem] gap-1.5 hover:bg-bg-base-2 rounded-lg min-w-[80px] cursor-pointer hover:text-primary-color-hover text-white">
                  <Share size={14} strokeWidth={3.5} />
                  <span className="text-sm">Chia sẻ</span>
                </div>
                <Link
                  href={`#comment`}
                  className="flex flex-col justify-center items-center p-[.6rem] gap-1.5 hover:bg-bg-base-2 rounded-lg min-w-[80px] cursor-pointer hover:text-primary-color-hover text-white"
                >
                  <MessageSquareMore size={14} strokeWidth={3.5} />
                  <span className="text-sm">Bình luận</span>
                </Link>
              </div>
            </div>
            <Tabs defaultValue="episodes" className="mt-10 w-full ">
              <TabsList className="w-full border-b border-border-color bg-transparent h-auto p-0 gap-10 flex items-center justify-start pl-5 rounded-none">
                <TabsTrigger
                  value="episodes"
                  className="border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-semibold text-text-base data-[state=active]:bg-transparent data-[state=active]:text-primary-color rounded-none cursor-pointer flex-none"
                >
                  Tập phim
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-semibold text-text-base data-[state=active]:bg-transparent data-[state=active]:text-primary-color rounded-none cursor-pointer flex-none"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="cast"
                  className="border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-semibold text-text-base data-[state=active]:bg-transparent data-[state=active]:text-primary-color rounded-none cursor-pointer flex-none"
                >
                  Diễn viên
                </TabsTrigger>
                <TabsTrigger
                  value="suggest"
                  className="border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-semibold text-text-base data-[state=active]:bg-transparent data-[state=active]:text-primary-color rounded-none cursor-pointer flex-none"
                >
                  Đề xuất
                </TabsTrigger>
              </TabsList>
              <TabsContent value="episodes" className="pt-6">
                <div>
                  <p className="text-2xl font-medium flex items-center gap-2 text-white">
                    <TextAlignStart size={20} strokeWidth={3.5} className="text-primary-color" /> Danh sách tập phim
                  </p>
                  {/* Danh sách tập phim */}
                  <div className="grid grid-cols-8 gap-4 mt-6 text-white">
                    {movie?.item?.episodes[0]?.server_data?.map((episode) => (
                      <Link
                        href={`/movie/watch/${movie?.slug}?ep=${episode.name}`}
                        key={episode._id}
                        className="flex justify-center items-center gap-2 bg-[#282B3A] rounded-sm h-[50px] hover:text-primary-color transition-all font-medium cursor-pointer"
                      >
                        <Play size={10} strokeWidth={3.5} />
                        <span className="text-base">Tập {episode.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="gallery" className="pt-6">
                <div className="grid grid-cols-4 gap-6">
                  {movie?.item?.images?.[0]?.images
                    ?.filter((img) => img.type === 'backdrop')
                    .map((img) => (
                      <Image
                        src={`${IMAGE_TMDB_ORIGINAL}${img.file_path}`}
                        alt={img.file_path}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover rounded-lg"
                        key={img._id}
                      />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="cast" className="pt-6">
                <div className="flex flex-wrap place-items-center gap-10">
                  <AvatarList actors={movie?.item?.actor || []} />
                </div>
              </TabsContent>
              <TabsContent value="suggest" className="pt-6">
                <div className="grid grid-cols-6 gap-4">
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
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-14 bg-border-color" />

            <div id="comment">
              <CommentForm />

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
        </div>
      </div>
    </div>
  );
}
