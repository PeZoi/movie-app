import http from "@/lib/http";
import { UserAuthResponseType } from "@/types/auth-type";
import { ResponseType } from "@/types/response-type";
import { ForgotPasswordFormValues, LoginFormValues, RegisterRequestBody } from "@/validation/auth-schemas";

export const authService = {
  login: (data: LoginFormValues) => http.post<UserAuthResponseType>('/api/v1/auth/login', data),
  register: (data: RegisterRequestBody) => http.post<UserAuthResponseType>('/api/v1/create-user', data),
  forgotPassword: (data: ForgotPasswordFormValues) => http.post<ResponseType<string>>('/api/v1/auth/forgot-password', data),
}