/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/store';
import { CategoryType } from '@/types/category-type';
import { CountryType } from '@/types/country-type';
import { Funnel } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FilterFormProps {
  defaultOpen?: boolean;
}

const FILM_TYPES = [
  { label: 'Tất cả', value: '' },
  { label: 'Phim lẻ', value: 'single' },
  { label: 'Phim bộ', value: 'series' },
];

const SORT_OPTIONS = [
  { label: 'Mới cập nhật', value: 'updated_at' },
  { label: 'Mới nhất', value: 'created_at' },
  { label: 'Năm', value: 'year' },
];

const YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i);

export default function FilterForm({ defaultOpen = false }: FilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categoryList, countryList } = useGlobalStore();

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>('updated_at');

  useEffect(() => {
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
    const type = searchParams.get('type') || '';
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const years = searchParams.get('years')?.split(',').filter(Boolean) || [];
    const sort = searchParams.get('sort') || 'updated_at';

    setSelectedCountries(countries);
    setSelectedType(type);
    setSelectedCategories(categories);
    setSelectedYears(years);
    setSelectedSort(sort);
  }, [searchParams]);

  const toggleCountry = (slug: string) => {
    setSelectedCountries((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
  };

  const toggleYear = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  };

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (selectedCountries.length > 0) {
      params.set('countries', selectedCountries.join(','));
    }
    if (selectedType) {
      params.set('type', selectedType);
    }
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (selectedYears.length > 0) {
      params.set('years', selectedYears.join(','));
    }
    if (selectedSort) {
      params.set('sort', selectedSort);
    }

    router.push(`/filter?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCountries([]);
    setSelectedType('');
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedSort('newest');
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-white font-semibold text-base mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );

  const FilterButton = ({
    label,
    isSelected,
    onClick,
  }: {
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-sm text-sm font-medium transition-all cursor-pointer ${
        isSelected
          ? 'bg-transparent border border-primary-color text-primary-color'
          : 'bg-bg-base-2 text-white border border-transparent hover:border-primary-color/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`w-full bg-bg-base rounded-lg overflow-hidden relative ${isOpen ? 'border border-border-color' : ''}`}
    >
      {/* Header - Collapse trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center transition-all gap-2 cursor-pointer w-fit ${isOpen ? 'px-6 py-4' : ''}`}
      >
        <Funnel size={14} strokeWidth={3.5} className="text-primary-color" />
        <h2 className="text-white text-lg font-bold">Bộ lọc</h2>
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pr-2">
          {/* Quốc gia */}
          <FilterSection title="Quốc gia">
            <FilterButton
              label="Tất cả"
              isSelected={selectedCountries.length === 0}
              onClick={() => setSelectedCountries([])}
            />
            {countryList.map((country: CountryType) => (
              <FilterButton
                key={country._id}
                label={country.name}
                isSelected={selectedCountries.includes(country.slug)}
                onClick={() => toggleCountry(country.slug)}
              />
            ))}
          </FilterSection>

          {/* Loại phim */}
          <FilterSection title="Loại phim">
            {FILM_TYPES.map((type) => (
              <FilterButton
                key={type.value}
                label={type.label}
                isSelected={selectedType === type.value}
                onClick={() => setSelectedType(type.value)}
              />
            ))}
          </FilterSection>

          {/* Thể loại */}
          <FilterSection title="Thể loại">
            <FilterButton
              label="Tất cả"
              isSelected={selectedCategories.length === 0}
              onClick={() => setSelectedCategories([])}
            />
            {categoryList.map((category: CategoryType) => (
              <FilterButton
                key={category._id}
                label={category.name}
                isSelected={selectedCategories.includes(category.slug)}
                onClick={() => toggleCategory(category.slug)}
              />
            ))}
          </FilterSection>

          {/* Năm sản xuất */}
          <div className="mb-6">
            <h3 className="text-white font-semibold text-base mb-3">Năm sản xuất</h3>
            <div className="flex flex-wrap gap-2 items-start">
              <FilterButton
                label="Tất cả"
                isSelected={selectedYears.length === 0}
                onClick={() => setSelectedYears([])}
              />
              <div className="flex flex-wrap gap-2 flex-1">
                {YEARS.map((year) => (
                  <FilterButton
                    key={year}
                    label={year.toString()}
                    isSelected={selectedYears.includes(year.toString())}
                    onClick={() => toggleYear(year.toString())}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sắp xếp */}
          <FilterSection title="Sắp xếp">
            {SORT_OPTIONS.map((option) => (
              <FilterButton
                key={option.value}
                label={option.label}
                isSelected={selectedSort === option.value}
                onClick={() => setSelectedSort(option.value)}
              />
            ))}
          </FilterSection>

          {/* Action buttons */}
          <div className="flex gap-4 mt-6 pt-4 border-t border-border-color">
            <Button
              onClick={handleFilter}
              className="bg-primary-color text-black hover:bg-primary-color-hover font-semibold"
            >
              Lọc kết quả →
            </Button>
            <Button onClick={handleReset} variant="outline" className="bg-bg-base-2 text-white border-border-color">
              Đặt lại
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
