import { UserType } from "@/types/user-type";
import { ResponseTypeWithExtraFields } from "@/types/response-type";

export type UserAuthResponseType = ResponseTypeWithExtraFields<UserType, { access_token: string }>;

export interface LoginResType {
  result: UserType;
  access_token: string;
}