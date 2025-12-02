import { ActorType } from "@/types/actor-type";
import { CategoryType } from "@/types/category-type";
import { CountryType } from "@/types/country-type";

// Image size URLs for backdrop
export interface BackdropImageSizes {
  original: string;
  w1280: string;
  w300: string;
  w780: string;
  _id: string;
}

// Image size URLs for poster
export interface PosterImageSizes {
  original: string;
  w154: string;
  w342: string;
  w500: string;
  w780: string;
  w92: string;
  _id: string;
}

// Image sizes container
export interface ImageSizes {
  backdrop: BackdropImageSizes;
  poster: PosterImageSizes;
  _id: string;
}

// Image data
export interface ImageData {
  width: number;
  height: number;
  type: string;
  file_path: string;
  _id: string;
}

// Movie image object
export interface MovieImage {
  image_sizes: ImageSizes;
  image: ImageData;
  images: ImageData[];
}

export interface ImdbType {
  id: string;
  vote_average: number;
  vote_count: number;
}

// Movie item details
export interface MovieItem {
  name: string;
  originName: string;
  type: string;
  status: string;
  description: string;
  posterUrl: string;
  thumbUrl: string;
  trailerUrl: string;
  time: string;
  episodeCurrent: string;
  episodeTotal: string;
  quality: string;
  lang: string;
  year: number;
  imdb: ImdbType;
  category: CategoryType[];
  country: CountryType[];
  episodes: EpisodeType[];
  actor: ActorType[];
  images: MovieImage[];
}


export interface EpisodeServerData {
  _id: string;
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeType {
  _id: string;
  server_name: string;
  movie_slug: string;
  is_ai: boolean;
  server_data: EpisodeServerData[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Main movie type
export interface MovieType {
  _id: string;
  slug: string;
  item: MovieItem;
  category: CategoryType[];
  images: MovieImage[];
}
