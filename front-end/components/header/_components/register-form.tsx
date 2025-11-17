'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '../../../validation/auth-schemas';
import SocialLoginButtons from './social-login-buttons';

interface RegisterFormProps {
  onViewChange: (view: 'login') => void;
  onSubmit: (data: RegisterFormValues) => void;
}

export default function RegisterForm({ onViewChange, onSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <>
      <DialogHeader className="space-y-2 text-center">
        <DialogTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <UserPlus size={24} />
          Đăng ký
        </DialogTitle>
        <DialogDescription className="text-gray-400">Tạo tài khoản mới để bắt đầu trải nghiệm</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  Họ và tên
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    className="bg-[#2A3453] border-[#3A4563] text-white placeholder:text-gray-500 focus:border-primary-color-hover h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="bg-[#2A3453] border-[#3A4563] text-white placeholder:text-gray-500 focus:border-primary-color-hover h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex items-center gap-2">
                  <Lock size={16} className="text-gray-400" />
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu của bạn"
                      className="bg-[#2A3453] border-[#3A4563] text-white placeholder:text-gray-500 focus:border-primary-color-hover h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex items-center gap-2">
                  <Lock size={16} className="text-gray-400" />
                  Xác nhận mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      className="bg-[#2A3453] border-[#3A4563] text-white placeholder:text-gray-500 focus:border-primary-color-hover h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 bg-primary-color-hover hover:bg-primary-color-hover/90 text-black font-semibold text-base rounded-md transition-all shadow-lg hover:shadow-xl"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>
      </Form>

      <SocialLoginButtons text="Hoặc đăng ký với" />

      <div className="text-center text-sm text-gray-400">
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={() => onViewChange('login')}
          className="text-primary-color-hover hover:text-primary-color-hover/80 transition-colors font-semibold cursor-pointer"
        >
          Đăng nhập ngay
        </button>
      </div>
    </>
  );
}
