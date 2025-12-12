import http from "@/lib/http";
import { CategoryType } from "@/types/category-type";
import { ResponseType } from "@/types/response-type";

export const categoryService = {
  getAllCategories: () => http.get<ResponseType<CategoryType[]>>('/api/v1/category', { cache: 'force-cache' })
}