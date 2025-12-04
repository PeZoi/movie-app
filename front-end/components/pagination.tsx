'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type PaginationComponentProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export default function PaginationComponent({ page = 1, totalPages, onPageChange }: PaginationComponentProps) {
  const [pageInput, setPageInput] = useState<string>(page.toString());

  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value)) || Number(value) <= 0 || Number(value) > totalPages) {
      return;
    }
    setPageInput(value);
  };

  const handlePageInputBlur = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange?.(pageNum);
    } else {
      setPageInput(page.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange?.(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange?.(page + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Left Navigation Button */}
      <button
        onClick={handlePrevious}
        disabled={page <= 1}
        className={cn(
          'flex items-center justify-center size-9 rounded-full',
          'bg-[#2c3143] text-white',
          'hover:bg-[#2c3143]/80 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        )}
        aria-label="Trang trước"
      >
        <ChevronLeft className="size-4 text-white" strokeWidth={3} />
      </button>

      {/* Center Page Information Section */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#2c3143]">
        <span className="text-white whitespace-nowrap">Trang</span>
        <input
          type="text"
          value={pageInput}
          onChange={handlePageInputChange}
          onBlur={handlePageInputBlur}
          onKeyDown={handlePageInputKeyDown}
          className={cn(
            'w-12 h-7 px-2 text-center rounded',
            'bg-[#1a1d2a] text-white',
            'border-none outline-none',
            'focus:ring-2 focus:ring-ring focus:ring-offset-1',
          )}
          aria-label="Số trang"
        />
        <span className="text-white whitespace-nowrap">/ {totalPages}</span>
      </div>

      {/* Right Navigation Button */}
      <button
        onClick={handleNext}
        disabled={page >= totalPages}
        className={cn(
          'flex items-center justify-center size-9 rounded-full',
          'bg-[#2c3143] text-white',
          'hover:bg-[#2c3143]/80 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        )}
        aria-label="Trang sau"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
