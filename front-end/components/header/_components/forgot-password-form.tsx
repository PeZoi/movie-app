'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../../validation/auth-schemas';

interface ForgotPasswordFormProps {
  onViewChange: (view: 'login') => void;
  onSubmit: (data: ForgotPasswordFormValues) => void;
}

export default function ForgotPasswordForm({ onViewChange, onSubmit }: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <>
      <DialogHeader className="space-y-2 text-center">
        <DialogTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Lock size={24} />
          Quên mật khẩu
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Nhập email của bạn để nhận link đặt lại mật khẩu
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
                    placeholder="Nhập email đã đăng ký"
                    className="bg-[#2A3453] border-[#3A4563] text-white placeholder:text-gray-500 focus:border-primary-color-hover h-11"
                    {...field}
                  />
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
            {form.formState.isSubmitting ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onViewChange('login')}
          className="text-primary-color-hover hover:text-primary-color-hover/80 transition-colors font-semibold cursor-pointer flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} />
          Quay lại đăng nhập
        </button>
      </div>
    </>
  );
}
