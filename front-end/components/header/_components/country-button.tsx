import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { countryAPI } from '@/services/country-service';
import { CountryType } from '@/types/country-type';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CountryButton() {
  const [countries, setCountries] = useState<CountryType[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const { payload } = await countryAPI.getAllCountries();
      const countries = payload.data?.result || [];
      setCountries(countries);
    };
    fetchCountries();
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          Quốc gia <ChevronDown size={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-3 bg-black" align="start" sideOffset={20}>
        <DropdownMenuGroup className="grid grid-cols-3 gap-y-2">
          {countries.map((country) => (
            <Link
              prefetch={false}
              key={country._id}
              className="block text-nowrap text-white cursor-pointer hover:text-primary-color py-2 pl-3 pr-8 hover:bg-bg-base rounded-sm text-[13px] w-[140px]"
              href={`/country/${country.slug}`}
            >
              {country.name}
            </Link>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
