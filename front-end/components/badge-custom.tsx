import { cn } from '@/lib/utils';
import React from 'react';

type BadgeCustomProps = {
  children: React.ReactNode;
  variant: 'filled' | 'outline' | 'imdb';
  frontSize?: number;
  className?: string;
};

export default function BadgeCustom({ children, variant = 'filled', frontSize = 12, className }: BadgeCustomProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 px-1.5 py-1 border rounded-sm text-white',
        variant === 'imdb' && 'border-primary-color',
        variant === 'outline' && 'border-white bg-[#ffffff10]',
        variant === 'filled' && 'bg-white text-black',
        className,
      )}
    >
      {variant === 'imdb' && <span className={`text-primary-color text-[${frontSize - 2}px] font-medium`}>IMDb</span>}
      <span className={`text-[${frontSize}px]`}>{children}</span>
    </div>
  );
}
