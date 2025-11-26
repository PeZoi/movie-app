import http from "@/lib/http";
import { MovieType } from "@/types/movie-type";
import { ResponseType } from "@/types/response-type";

export const movieService = {
  getMovieBySlug: async (slug: string) => http.get<ResponseType<MovieType>>(`/api/v1/movie/${slug}`),
};