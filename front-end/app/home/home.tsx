'use client';

import SliderMovies from '@/app/home/_components/slide-movies';
import HoverCardMovie from '@/components/hover-card-movie';
import { ChevronRight, Heart, Info, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react/jsx-runtime';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const LIST_CATEGORY: { id: number; name: string; bgColor: string }[] = [
  { id: 1, name: 'Phim viễn tưởng', bgColor: '#566ED9' },
  { id: 2, name: 'Phim hành động', bgColor: '#8181AB' },
  { id: 3, name: 'Phim Hành Động', bgColor: '#419A85' },
  { id: 4, name: 'Phim kinh dị', bgColor: '#8E7CC1' },
  { id: 5, name: 'Phim tình cảm', bgColor: '#D5947A' },
  { id: 6, name: 'Phim hài hước', bgColor: '#B55A5A' },
  { id: 7, name: 'Phim 18+', bgColor: '#515564' },
];

const LIST_MOVIE_KOREAN: {
  id: number;
  name_vi: string;
  name_en: string;
  image: string;
  image_hover: string;
  categories: string[];
}[] = [
  {
    id: 1,
    name_vi: 'Frankenstein',
    name_en: 'Frankenstein',
    image: 'https://static.nutscdn.com/vimg/300-0/d3603356f582aaf056d4df51fce402c7.webp',
    image_hover: 'https://static.nutscdn.com/vimg/0-0/080c3b5425ee854cc4e0bd38bc7b4a5e.webp',
    categories: ['Kinh dị', 'Viễn tưởng', 'Cổ Điển'],
  },
  {
    id: 2,
    name_vi: 'Vận May',
    name_en: 'Good Fortune',
    image: 'https://static.nutscdn.com/vimg/300-0/b4f0ad68a856b7f1e7e431d56cf9c910.webp',
    image_hover: 'https://static.nutscdn.com/vimg/0-0/080c3b5425ee854cc4e0bd38bc7b4a5e.webp',
    categories: ['Kinh dị', 'Viễn tưởng', 'Cổ Điển'],
  },
  {
    id: 3,
    name_vi: 'Hẹn Hò Với Sát Nhân',
    name_en: 'Woman of the Hour',
    image: 'https://static.nutscdn.com/vimg/300-0/8c1168c231ec8ca065e192e981a130de.jpg',
    image_hover: 'https://static.nutscdn.com/vimg/0-0/080c3b5425ee854cc4e0bd38bc7b4a5e.webp',
    categories: ['Kinh dị', 'Viễn tưởng', 'Cổ Điển'],
  },
];

export default function Home() {
  return (
    <div className="h-[2000px] bg-bg-base">
      <SliderMovies />

      <div className="px-5 flex flex-col gap-10">
        <div>
          <h2 className="text-3xl font-medium text-white">Bạn đang quan tâm gì?</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mt-10">
            {LIST_CATEGORY.map((item) => (
              <Link
                href={`/category/${item.id}`}
                key={item.id}
                className="block rounded-lg hover:-translate-y-1 transition-all duration-300 p-[1.2rem_2.5rem_1.2rem_1.5rem]"
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="min-h-[110px] text-white flex flex-col justify-center">
                  <p className="text-start font-bold text-xl mt-1">{item.name}</p>
                  <span className="flex items-center gap-2 text-base font-medium flex-1 text-center">
                    Xem chi tiết <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

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
            Phim Hàn Quốc
          </h2>
          <div className="overflow-hidden mt-10">
            <Swiper slidesPerView={8} spaceBetween={10}>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <Fragment key={index}>
                    {LIST_MOVIE_KOREAN.map((item) => (
                      <SwiperSlide key={item.id + '_' + index}>
                        <div>
                          <HoverCardMovie data={item}>
                            <Link href={`/movie/${item.id}`}>
                              <Image
                                src={item.image}
                                alt={item.name_vi}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover rounded-xl hover:opacity-80"
                              />
                            </Link>
                          </HoverCardMovie>
                          <div className="text-center mt-3">
                            <Link
                              href={`/movie/${item.id}`}
                              className="block text-white text-base hover:text-primary-color transition-all duration-300"
                            >
                              {item.name_vi}
                            </Link>
                            <Link href={`/movie/${item.id}`} className="block text-gray-500 text-sm">
                              {item.name_en}
                            </Link>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Fragment>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
