'use client';

import ForgotPasswordForm from '@/components/header/_components/forgot-password-form';
import LoginForm from '@/components/header/_components/login-form';
import RegisterForm from '@/components/header/_components/register-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store';
import {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  RegisterRequestBody,
} from '@/validation/auth-schemas';
import React, { useState } from 'react';
import { toast } from 'sonner';

type ViewType = 'login' | 'register' | 'forgot-password';

type DialogAuthProps = {
  children: React.ReactNode;
};

export default function DialogAuth({ children }: DialogAuthProps) {
  const { handleLoginSuccess } = useAuthStore();
  const [view, setView] = useState<ViewType>('login');

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);
      if (response.data) {
        handleLoginSuccess(response.data.result, response.data.access_token);
        toast.success('Đăng nhập thành công');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    const requestBody: RegisterRequestBody = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await authService.register(requestBody);
      if (response.data) {
        handleLoginSuccess(response.data.result, response.data.access_token);
      }
    } catch (error: unknown) {
      console.error('Register error:', error);
    }
  };

  const onForgotPasswordSubmit = (data: ForgotPasswordFormValues) => {
    console.log('Forgot password data:', data);
    // TODO: Implement forgot password logic here
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-md p-0 rounded-xl border-none gap-0 bg-[#1E2545] overflow-hidden">
        <div className="p-8 space-y-6">
          {view === 'login' && <LoginForm onViewChange={handleViewChange} onSubmit={onLoginSubmit} />}
          {view === 'register' && <RegisterForm onViewChange={handleViewChange} onSubmit={onRegisterSubmit} />}
          {view === 'forgot-password' && (
            <ForgotPasswordForm onViewChange={handleViewChange} onSubmit={onForgotPasswordSubmit} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
