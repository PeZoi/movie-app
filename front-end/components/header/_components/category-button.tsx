import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { categoryAPI } from '@/services/category-service';
import { CategoryType } from '@/types/category-type';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CategoryButton() {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await categoryAPI.getAllCategories();
      const categories = data?.result || [];
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          Thể loại <ChevronDown size={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-3 bg-black" align="start" sideOffset={20}>
        <DropdownMenuGroup className="grid grid-cols-3 gap-y-2">
          {categories?.map((category) => (
            <Link
              prefetch={false}
              key={category._id}
              className="block text-nowrap text-white cursor-pointer hover:text-primary-color py-2 pl-3 pr-8 hover:bg-bg-base rounded-sm text-[13px] w-[140px]"
              href={`/category/${category.slug}`}
            >
              {category.name}
            </Link>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
