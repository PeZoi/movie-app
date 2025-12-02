/* eslint-disable @next/next/no-img-element */
'use client';

import CategoryButton from '@/components/header/_components/category-button';
import CountryButton from '@/components/header/_components/country-button';
import LoginButton from '@/components/header/_components/login-button';
import Search from '@/components/header/_components/search';
import { RO_PHIM_IMG_URL } from '@/constants/env';
import { useAuthStore } from '@/store/auth-store';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { loadDataFromLocalStorage } = useAuthStore();

  useEffect(() => {
    loadDataFromLocalStorage();
  }, [loadDataFromLocalStorage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-between px-[20px] transition-all duration-300 gap-6 fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? 'bg-bg-base h-[70px]' : 'bg-transparent h-[90px]'
      }`}
    >
      <Link href="/" className="flex items-center justify-center">
        <img src={`${RO_PHIM_IMG_URL}/logo.svg`} alt="logo" className="w-auto h-[40px]" />
      </Link>
      <Search />
      <div className="flex-1 w-full flex items-center justify-between">
        <ul className="flex items-center gap-6 text-white text-[13px]">
          <li className="hover:text-primary-color-hover">
            <Link href="/filter?type=single">Phim Lẻ</Link>
          </li>
          <li className="hover:text-primary-color-hover">
            <Link href="/filter?type=series">Phim Bộ</Link>
          </li>
          <li className="flex items-center gap-1 cursor-pointer">
            <CategoryButton />
          </li>
          <li className="flex items-center gap-1 cursor-pointer">
            <CountryButton />
          </li>
          <li className="hover:text-primary-color-hover">
            <Link href="/">Xem Chung</Link>
          </li>
          <li className="flex items-center gap-1 cursor-pointer">
            Thêm <ChevronDown size={14} />
          </li>
        </ul>
        <LoginButton />
      </div>
    </div>
  );
}
