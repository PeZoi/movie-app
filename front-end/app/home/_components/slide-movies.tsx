'use client';

import { Separator } from '@/components/ui/separator';
import { Heart, Info, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const DATA_SLIDE: { id: number; thumbnail: string; logo: string; title: string; description: string }[] = [
  {
    id: 1,
    thumbnail: 'https://static.nutscdn.com/vimg/1920-0/f03b47a5703e5bd09aa1a0c937d2f6f2.webp',
    logo: 'https://static.nutscdn.com/vimg/0-260/c5824c6a13ca5037a869c03607067385.png',
    title: 'Black Phone 2',
    description:
      'Bốn năm trước, Finn khi mới 13 tuổi đã giết chết kẻ bắt cóc mình và trốn thoát thành công, trở thành người duy nhất sống sót sau vụ án của The Grabber - một kẻ sát nhân khét tiếng. Nhưng cái ác thực sự không chết đi… và chiếc điện thoại đen lại một lần nữa đổ chuông. Khi Finn nay đã 17 tuổi và vẫn vật lộn với hậu chấn tâm lý sau vụ bắt cóc, còn cô em gái 15 tuổi Gwen bắt đầu nhận được các cuộc gọi trong giấc mơ từ chiếc điện thoại đen kỳ lạ, cùng với những hình ảnh rùng rợn. Quyết tâm khám phá sự thật và chấm dứt cơn ác mộng cho cả bản thân lẫn anh trai, Gwen thuyết phục Finn cùng đến trại trong lúc có bão tuyết. Tại đây, cô phát hiện ra một bí mật kinh hoàng liên quan đến The Grabber và cả quá khứ của gia đình mình. Giờ đây, 2 anh em buộc phải đối đầu với một kẻ sát nhân không chỉ mạnh mẽ hơn sau khi chết, mà còn có mối liên hệ sâu sắc với họ hơn những gì họ từng tưởng tượng.',
  },
  {
    id: 2,
    thumbnail: 'https://static.nutscdn.com/vimg/1920-0/912812e95abbf368f574df3274c05a0b.jpg',
    logo: 'https://static.nutscdn.com/vimg/0-260/01521d5209e0b2c8e3eff67dc430890f.png',
    title: 'Chó Cưng Đừng Sợ',
    description:
      'Phim kể về chú chó Indy, chuyển đến sống cùng chủ nhân Todd ở một ngôi nhà nông thôn. Indy sớm phát hiện ra những thế lực siêu nhiên ẩn nấp trong bóng tối và phải chiến đấu để bảo vệ người chủ yêu thương khi những thực thể hắc ám đe dọa Todd.',
  },
  {
    id: 3,
    thumbnail: 'https://static.nutscdn.com/vimg/1920-0/3ae2a6a609817b5561e3585a5f9db0e0.webp',
    logo: 'https://static.nutscdn.com/vimg/0-260/7f059498ab843c3784021f2b453c45cf.png',
    title: 'TRON: Ares',
    description:
      'Trò Chơi Ảo Giác (TRON: Ares) theo chân Ares – một thực thể ảo cực kỳ tinh vi được cử từ thế giới số đến thế giới thực trong một nhiệm vụ nguy hiểm, đánh dấu cuộc chạm trán đầu tiên giữa loài người và những thực thể trí tuệ nhân tạo.',
  },
];

export default function SliderMovies() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="h-[760px]">
      <Swiper
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        loop={true}
        className="h-full relative"
      >
        {DATA_SLIDE.map((data: { id: number; thumbnail: string; logo: string; title: string; description: string }) => (
          <SwiperSlide key={data.id}>
            <div className="relative w-full h-[calc(100%-60px)]">
              <div className="relative w-full h-full">
                <Image
                  src={data.thumbnail}
                  alt="slide"
                  width={1000}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 animate-cover-fade"
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%), linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0) 85%, rgba(0,0,0,0.4) 100%)',
                }}
              ></div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 max-w-[700px] py-24 px-12">
                <Link href="/">
                  <Image src={data.logo} alt="logo" width={260} height={260} className="w-full h-full object-cover" />
                </Link>
                <p className="text-primary-color text-[16px] my-4 text-shadow-[0 1px 1px rgba(0,0,0,.2)]">
                  {data.title}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-1.5 py-1 border border-primary-color rounded-sm">
                    <span className="text-primary-color text-[10px] font-medium">IMDb</span>
                    <span className="font-medium text-white text-[12px]">6.6</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-1 border rounded-sm bg-white">
                    <strong className="text-[12px]">T18</strong>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-1 border border-white rounded-sm bg-[#ffffff10]">
                    <span className="text-[12px] text-white">2025</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-1 border border-white rounded-sm bg-[#ffffff10]">
                    <span className="text-[12px] text-white">1h 54m</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2.5 mb-4">
                  <Link
                    href="/"
                    className="flex items-center gap-1 px-1.5 py-1 rounded-sm bg-[#ffffff10] text-white text-[12px] hover:text-primary-color"
                  >
                    Chiếu Rạp
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-1 px-1.5 py-1 rounded-sm bg-[#ffffff10] text-white text-[12px] hover:text-primary-color"
                  >
                    Gay Cấn
                  </Link>
                </div>

                <p className="text-white line-clamp-3 leading-relaxed text-shadow-[0 1px 1px rgba(0,0,0,.2)]">
                  {data.description}
                </p>

                <div className="flex items-center gap-10 mt-4">
                  <Link
                    href="/"
                    className="flex items-center justify-center w-[70px] h-[70px] rounded-full bg-primary-color-gradient opacity-90 hover:opacity-100 hover:shadow-[0_5px_10px_10px_rgba(255,218,125,0.15)] transition-all duration-300"
                  >
                    <Play size={24} color="#000000" strokeWidth={3} />
                  </Link>
                  <div className="rounded-full border-2 border-border-color hover:border-white flex items-center">
                    <Link
                      href="/"
                      className="flex items-center justify-center w-[68px] h-[50px] rounded-l-full text-white hover:text-primary-color hover:bg-bg-base-2 transition-all duration-300"
                    >
                      <Heart size={24} strokeWidth={3} />
                    </Link>
                    <Separator orientation="vertical" className="self-stretch bg-bg-base-2 h-auto" />
                    <Link
                      href="/"
                      className="flex items-center justify-center w-[68px] h-[50px] rounded-r-full text-white hover:text-primary-color hover:bg-bg-base-2 transition-all duration-300"
                    >
                      <Info size={24} strokeWidth={3} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Thumbnail Pagination */}
        <div className="absolute bottom-35 right-15 z-1 flex gap-5">
          {DATA_SLIDE.map((data, index) => (
            <button
              key={data.id}
              onClick={() => {
                if (swiperRef.current) {
                  swiperRef.current.slideToLoop(index);
                }
              }}
              className={`relative w-18 h-12 rounded-md overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                activeIndex === index ? 'border-white scale-110' : 'border-transparent hover:border-white'
              }`}
            >
              <Image src={data.thumbnail} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      </Swiper>
    </div>
  );
}
