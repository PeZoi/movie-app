import Link from 'next/link';
import React from 'react';

type BadgeCategoryProps = {
  category: string;
};

export default function BadgeCategory({ category }: BadgeCategoryProps) {
  return (
    <Link
      href={`/category/${category}`}
      className="flex items-center gap-1 px-1.5 py-1 rounded-sm bg-[#ffffff10] text-white text-[12px] hover:text-primary-color"
    >
      {category}
    </Link>
  );
}
