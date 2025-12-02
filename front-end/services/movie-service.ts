import http from "@/lib/http";
import { MovieType } from "@/types/movie-type";
import { ResponseType } from "@/types/response-type";

export const movieService = {
  getMovieBySlug: async (slug: string) => http.get<ResponseType<MovieType>>(`/api/v1/movie/${slug}`),
  getMoviesByCategory: async (categorySlug: string, page: number = 1, limit: number = 32) => http.get<ResponseType<MovieType[]>>(`/api/v1/movie/category/${categorySlug}?current=${page}&pageSize=${limit}`, { cache: 'force-cache' }),
  getMoviesByCountry: async (countrySlug: string, page: number = 1, limit: number = 32) => http.get<ResponseType<MovieType[]>>(`/api/v1/movie/country/${countrySlug}?current=${page}&pageSize=${limit}`, { cache: 'force-cache' }),
  getMoviesByFilter: async (type: string, categories: string, countries: string, years: string, sort: string, page: number = 1, limit: number = 1000) => http.get<ResponseType<MovieType[]>>(`/api/v1/movie/filter?type=${type || ''}&categories=${categories || ''}&countries=${countries || ''}&years=${years || ''}&sort=${sort || ''}&current=${page}&pageSize=${limit}`)
};