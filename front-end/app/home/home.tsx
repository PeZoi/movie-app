'use client';

import Collection from '@/app/home/_components/collection';
import SliderMovies from '@/app/home/_components/slide-movies';
import { homeService } from '@/services/home-service';
import { CollectionType } from '@/types/collection-type';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'swiper/css';

const LIST_CATEGORY: { id: number; name: string; slug: string; bgColor: string }[] = [
  { id: 1, name: 'Phim viễn tưởng', slug: 'vien-tuong', bgColor: '#566ED9' },
  { id: 2, name: 'Phim hành động', slug: 'hanh-dong', bgColor: '#8181AB' },
  { id: 3, name: 'Phim tâm lý', slug: 'tam-ly', bgColor: '#419A85' },
  { id: 4, name: 'Phim kinh dị', slug: 'kinh-di', bgColor: '#8E7CC1' },
  { id: 5, name: 'Phim tình cảm', slug: 'tinh-cam', bgColor: '#D5947A' },
  { id: 6, name: 'Phim hài hước', slug: 'hai-huoc', bgColor: '#B55A5A' },
  { id: 7, name: 'Phim 18+', slug: 'phim-18', bgColor: '#515564' },
];

export default function Home() {
  const [collectionList, setCollectionList] = useState<CollectionType[]>([]);

  useEffect(() => {
    const fetchCollectionList = async () => {
      const response = await homeService.getCollectionList(1, 5);

      setCollectionList(response?.data?.result || []);
    };
    fetchCollectionList();
  }, []);

  return (
    <div className="h-[2000px] bg-bg-base">
      <SliderMovies />

      <div className="px-5 flex flex-col gap-10">
        <div>
          <h2 className="text-3xl font-medium text-white">Bạn đang quan tâm gì?</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mt-10">
            {LIST_CATEGORY.map((item) => (
              <Link
                href={`/filter?categories=${item.slug}`}
                key={item.slug}
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

        <div className="space-y-10">
          {collectionList
            .filter((collection: CollectionType) => collection?.movies?.length > 0)
            .map((collection: CollectionType) => (
              <Collection key={collection?._id} collection={collection} />
            ))}
        </div>
      </div>
    </div>
  );
}
