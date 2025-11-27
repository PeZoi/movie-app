import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function MovieSuggestItem() {
  return (
    <div className="flex w-full rounded-lg overflow-hidden bg-[#ffffff05]">
      <Link href={'/movie/1'} className="block">
        <Image
          src={'https://static.nutscdn.com/vimg/300-0/c7cc2dd6ed76855511f7a1f199ed2344.jpg'}
          alt="movie"
          width={80}
          height={120}
          className="object-cover rounded-lg"
        />
      </Link>
      <div className="py-2.5 px-3 space-y-1.5 mt-1">
        <Link href={'/movie/1'} className="block">
          <p className="text-base text-white font-medium hover:text-primary-color transition-all duration-300">
            Người Tình Ẩn Danh
          </p>
        </Link>
        <p className="text-sm text-[#aaa]">The Biggest Fan</p>
        <div className="flex items-center gap-2 text-sm text-[#aaa]">
          <strong>T13</strong>
          <span>•</span>
          <span>2025</span>
          <span>•</span>
          <span>1h 31m</span>
        </div>
      </div>
    </div>
  );
}
