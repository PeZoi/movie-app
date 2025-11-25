'use client';

import Comment from '@/app/movie/_components/comment';
import CommentForm from '@/app/movie/_components/comment-form';
import EpisodeList from '@/app/movie/_components/episode-list';
import MovieSuggestItem from '@/app/movie/_components/movie-suggest-item';
import BadgeCategory from '@/components/badge-category';
import BadgeCustom from '@/components/badge-custom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
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

export default function Index() {
  const { user } = useAuthStore();

  return (
    <div className="bg-bg-base">
      <div className="wrapper text-white">
        <div className="max-w-[1640px] mx-auto px-5">
          <h3 className="text-2xl font-bold flex items-center gap-5 mb-6 px-10">
            <Link href="/" className="border border-white rounded-full p-1">
              <ChevronLeft size={14} strokeWidth={3.5} />
            </Link>
            Xem phim Đao kiếm Thần Vực
          </h3>
          <div className="rounded-xl overflow-hidden">
            <div className="h-[900px]">
              <iframe
                src="https://vip.opstream11.com/share/68d13cf26c4b4f4f932e3eff990093ba"
                frameBorder="0"
                className="w-full h-full"
              ></iframe>
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
                  src="https://static.nutscdn.com/vimg/300-0/465fbecfe8c35a084f3cf75b10a63cd1.webp"
                  alt="Nyaight of the Living Cat"
                  width={100}
                  height={150}
                  className="rounded-md"
                />
              </div>
              <div className="w-[440px] shrink-0">
                <h3 className="text-xl font-bold">Đao kiếm Thần Vực</h3>
                <h5 className="text-sm text-primary-color my-4">Sword Art Online</h5>
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
                <div className="flex items-center gap-2 my-4">
                  <BadgeCategory category="Hành Động" />
                  <BadgeCategory category="Anime" />
                  <BadgeCategory category="Hoạt Hình" />
                  <BadgeCategory category="Kỳ Ảo" />
                </div>
                <div className="py-2 px-3 bg-[#22cb4c1a] text-[#22cb4c] flex items-center justify-center gap-2 w-fit rounded-full">
                  <BadgeCheck size={16} strokeWidth={2} />
                  <span className="text-xs">Đã hoàn thành: 25 / 25 tập</span>
                </div>
                <div className="py-2 px-3 bg-[#ff83001a] text-[#ff8300] flex items-center justify-center gap-2 w-fit rounded-full">
                  <LoaderCircle size={16} strokeWidth={2} className="animate-spin" />
                  <span className="text-xs">Đã chiếu: 5 / 12 tập</span>
                </div>
              </div>
              <div className="grow pl-10">
                <p className="line-clamp-3 text-sm text-text-base leading-6">
                  Một chuyên gia về trò chơi điện tử tạo ra công nghệ mới cho phép người chơi điều khiển nhân vật ảo
                  bằng chính cơ thể của họ. Tuy nhiên, rắc rối đáng sợ lại nảy sinh.
                </p>
                <Link
                  href={'/movie/1'}
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
              <EpisodeList />
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
                {Array.from({ length: 10 }).map((_, index) => (
                  <Link href={'/author/1'} className="flex flex-col items-center justify-center gap-2" key={index}>
                    <Avatar className="size-20">
                      <AvatarImage
                        src="https://image.tmdb.org/t/p/w500/ugDwdWEXnmv43jcbnfAi4XwiQ8C.jpg"
                        className="object-cover"
                      />
                      <AvatarFallback>N</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-wrap text-center">Yoshitsugu Yoshitsugu</p>
                  </Link>
                ))}
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
