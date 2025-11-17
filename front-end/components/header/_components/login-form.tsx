'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../../../validation/auth-schemas';
import SocialLoginButtons from './social-login-buttons';

interface LoginFormProps {
  onViewChange: (view: 'register' | 'forgot-password') => void;
  onSubmit: (data: LoginFormValues) => void;
}

export default function LoginForm({ onViewChange, onSubmit }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <>
      <DialogHeader className="space-y-2 text-center">
        <DialogTitle className="text-2xl font-bold text-white">Đăng nhập</DialogTitle>
        <DialogDescription className="text-gray-400">
          Đăng nhập để tiếp tục trải nghiệm dịch vụ của chúng tôi
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    className="bg-[#2A3453] border-[#3A4563] text-white placeholder:text-gray-500 focus:border-primary-color-hover h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end text-sm">
            <button
              type="button"
              onClick={() => onViewChange('forgot-password')}
              className="text-primary-color-hover hover:text-primary-color-hover/80 transition-colors cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary-color-hover hover:bg-primary-color-hover/90 text-black font-semibold text-base rounded-md transition-all shadow-lg hover:shadow-xl"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </Form>

      <SocialLoginButtons text="Hoặc đăng nhập với" />

      <div className="text-center text-sm text-gray-400">
        Chưa có tài khoản?{' '}
        <button
          type="button"
          onClick={() => onViewChange('register')}
          className="text-primary-color-hover hover:text-primary-color-hover/80 transition-colors font-semibold cursor-pointer"
        >
          Đăng ký ngay
        </button>
      </div>
    </>
  );
}
