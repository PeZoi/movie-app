'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, Heart, History, List, LogOut, User } from 'lucide-react';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import ForgotPasswordForm from './forgot-password-form';
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  RegisterRequestBody,
} from '../../../validation/auth-schemas';
import { authAPI } from '@/services/auth-service';
import { useAuthStore } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { toast } from 'sonner';
import { RO_PHIM_IMG_URL } from '@/constants/env';
import { useRouter } from 'next/navigation';
import DialogAuth from '@/components/dialog-auth';

const MENU_PROFILE_ITEMS = [
  {
    label: 'Yêu thích',
    icon: <Heart size={16} strokeWidth={3} />,
    href: '/movie-favorite',
  },
  {
    label: 'Danh sách',
    icon: <List size={16} strokeWidth={3} />,
    href: '/watch-list',
  },
  {
    label: 'Xem tiếp',
    icon: <History size={16} strokeWidth={3} />,
    href: '/continue-watching',
  },
  {
    label: 'Tài khoản',
    icon: <User size={16} strokeWidth={3} />,
    href: '/profile',
  },
];

export default function LoginButton() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <div className="w-fit flex items-center justify-center gap-3 cursor-pointer">
                <Avatar className="size-[38px]">
                  <AvatarImage src={`${RO_PHIM_IMG_URL}/${user.avatar.path}`} alt="@shadcn" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} strokeWidth={3} color="white" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="px-0 pt-4 pb-1 w-[200px] text-[13px] text-white bg-[#272c43] border-none -left-3.5!"
              align="start"
              sideOffset={20}
              side="bottom"
            >
              <DropdownMenuGroup>
                <p className="text-xs px-4">
                  <span>Xin chào, </span>
                  <span className="font-bold">{user.name}</span>
                </p>
                <Separator className="my-3" />
                <div className="">
                  {MENU_PROFILE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 cursor-pointer py-2.5 px-4 hover:bg-bg-base-2"
                    >
                      <span>{item.icon}</span> <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
                <Separator className="my-3" />
                <div
                  className="flex items-center gap-3 cursor-pointer py-2.5 px-4 hover:bg-bg-base-2"
                  onClick={handleLogout}
                >
                  <span>
                    <LogOut size={16} strokeWidth={3} />
                  </span>{' '}
                  <span>Đăng xuất</span>
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <DialogAuth>
          <button className="min-w-32 rounded-full text-black bg-white py-2 px-3 text-base font-medium flex items-center justify-center gap-2 border border-[rgba(255,255,255,.5)] cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
            <User size={16} strokeWidth={3} /> <span>Thành viên</span>
          </button>
        </DialogAuth>
      )}
    </>
  );
}
