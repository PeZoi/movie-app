import { CategoryType } from '@/types/category-type';
import Link from 'next/link';
import React from 'react';

type BadgeCategoryProps = {
  category: CategoryType;
};

export default function BadgeCategory({ category }: BadgeCategoryProps) {
  return (
    <Link
      href={`/filter?categories=${category?.slug}`}
      className="flex items-center gap-1 px-1.5 py-1 rounded-sm bg-[#ffffff10] text-white text-[12px] hover:text-primary-color"
    >
      {category?.name}
    </Link>
  );
}
