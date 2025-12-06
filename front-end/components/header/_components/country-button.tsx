'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { countryAPI } from '@/services/country-service';
import { useGlobalStore } from '@/store';
import { CountryType } from '@/types/country-type';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CountryButton() {
  const { countryList, setCountryList } = useGlobalStore();

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await countryAPI.getAllCountries();
      setCountryList(data?.result || []);
    };
    fetchCountries();
  }, [setCountryList]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer" suppressHydrationWarning>
          Quốc gia <ChevronDown size={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-3 bg-black" align="start" sideOffset={20}>
        <DropdownMenuGroup className="grid grid-cols-3 gap-y-2">
          {countryList?.map((country: CountryType) => (
            <Link
              prefetch={false}
              key={country._id}
              className="block text-nowrap text-white cursor-pointer hover:text-primary-color py-2 pl-3 pr-8 hover:bg-bg-base rounded-sm text-[13px] w-[140px]"
              href={`/filter?countries=${country.slug}`}
            >
              {country.name}
            </Link>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
