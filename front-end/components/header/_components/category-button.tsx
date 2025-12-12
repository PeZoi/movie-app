'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { categoryService } from '@/services/category-service';
import { useGlobalStore } from '@/store';
import { CategoryType } from '@/types/category-type';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CategoryButton() {
  const { categoryList, setCategoryList } = useGlobalStore();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await categoryService.getAllCategories();
      setCategoryList(data?.result || []);
    };
    fetchCategories();
  }, [setCategoryList]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer" suppressHydrationWarning>
          Thể loại <ChevronDown size={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-3 bg-black" align="start" sideOffset={20}>
        <DropdownMenuGroup className="grid grid-cols-3 gap-y-2">
          {categoryList?.map((category: CategoryType) => (
            <Link
              prefetch={false}
              key={category._id}
              className="block text-nowrap text-white cursor-pointer hover:text-primary-color py-2 pl-3 pr-8 hover:bg-bg-base rounded-sm text-[13px] w-[140px]"
              href={`/filter?categories=${category.slug}`}
            >
              {category.name}
            </Link>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
