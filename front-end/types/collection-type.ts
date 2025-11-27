import { MovieType } from "@/types/movie-type";

// Collection filter type
export interface CollectionFilter {
  country_code?: string[];
  status?: string[];
  type?: string;
  top_views?: string;
  limit?: number;
  sort_by?: string;
  order?: number;
}

// Main collection type
export interface CollectionType {
  _id: string;
  name: string;
  slug: string;
  color: string;
  order: number;
  style: number;
  random_data: boolean;
  type: number;
  filter: CollectionFilter;
  createdAt: string;
  updatedAt: string;
  __v: number;
  movies: MovieType[];
  totalItem: number;
}
