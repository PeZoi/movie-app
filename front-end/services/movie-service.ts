import http from "@/lib/http";
import { MovieType } from "@/types/movie-type";
import { PaginationResponseType, ResponseType } from "@/types/response-type";

export const movieService = {
  getMovieBySlug: async (slug: string) => http.get<ResponseType<MovieType>>(`/api/v1/movie/${slug}`),
  getMoviesByFilter: async (type: string, categories: string, countries: string, years: string, sort: string, page: string = '1', limit: string = '32') => http.get<PaginationResponseType<MovieType[]>>(`/api/v1/movie/filter?type=${type || ''}&categories=${categories || ''}&countries=${countries || ''}&years=${years || ''}&sort=${sort || ''}&current=${page}&pageSize=${limit}`),

  // API đề xuất lấy theo category của bộ phim đó
  getMoviesSuggestion: async (categories: string) => http.get<PaginationResponseType<MovieType[]>>(`/api/v1/movie/filter?categories=${categories || ''}&sort=updated_at&current=1&pageSize=10`),
};