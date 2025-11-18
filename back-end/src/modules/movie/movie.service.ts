import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Types } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

import { CreateMovieDto } from './dto/create-movie.dto';
import axios from 'axios';
import { Movie } from './schemas/movie.schema';
import { ActorService } from '../actor/actor.service';
import { Category } from '@/modules/category/schemas/category.schema';
import { Country } from '@/modules/country/schemas/country.schema';
import { Episodes, EpisodesDocument } from '@/modules/episodes/schema/episodes.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private MovieModel: Model<Movie>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Country.name) private CountryModel: Model<Country>,
    @InjectModel(Episodes.name) private EpisodesModel: Model<Episodes>,
    private readonly ActorService: ActorService,
    private readonly configService: ConfigService,
  ) {}

  async getMovie(slug: string) {
    const i18n = I18nContext.current();
    const isMovie = await this.findBySlug(slug);

    if (!isMovie) {
      throw new BadRequestException(i18n.t('movie.MOVIE_NOT_FOUND'));
    }

    const results = await isMovie.populate([
      {
        path: 'item.episodes',
      },
      {
        path: 'item.country',
        select: 'name',
      },
      {
        path: 'item.category',
        select: 'name',
      },
      {
        path: 'item.actor',
        select: 'name',
      },
    ]);
    return {
      message: await I18nContext.current().t('movie.GET_SUCCESS'),
      data: { results },
    };
  }

  async getMovieByCategory(slug: string, current: number, pageSize: number) {
    try {
      const i18n = I18nContext.current();
      if (!current) current = 1;
      if (!pageSize) pageSize = 10;

      const category = await this.categoryModel.findOne({ slug }).select('_id').lean();
      if (!category) throw new BadRequestException(i18n.t('category.CATEGORY_NOT_FOUND'));
      const skip = (current - 1) * pageSize;

      const results = await this.MovieModel.find({
        'item.category': category._id,
      })
        .skip(skip)
        .limit(pageSize)
        .sort({ 'item.year': -1 })
        .populate([
          {
            path: 'item.episodes',
          },
          {
            path: 'item.country',
            select: 'name',
          },
          {
            path: 'item.category',
            select: 'name',
          },
          {
            path: 'item.actor',
            select: 'name',
          },
        ])
        .lean();

      const totalItems = await this.MovieModel.countDocuments({
        'item.category': category._id,
      });

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: { results, totalPages, totalItems },
      };
    } catch (error) {
      throw new Error(`Cannot get movies by category: ${error.message}`);
    }
  }

  async getMovieByCountry(slug: string, current: number, pageSize: number) {
    try {
      const i18n = I18nContext.current();

      if (!current) current = 1;
      if (!pageSize) pageSize = 10;

      const country = await this.CountryModel.findOne({ slug }).select('_id').lean();
      if (!country) throw new BadRequestException(i18n.t('country.COUNTRY_NOT_FOUND'));
      const skip = (current - 1) * pageSize;

      const results = await this.MovieModel.find({
        'item.country': country._id,
      })
        .skip(skip)
        .limit(pageSize)
        .sort({ 'item.year': -1 })
        .populate([
          {
            path: 'item.episodes',
          },
          {
            path: 'item.country',
            select: 'name',
          },
          {
            path: 'item.category',
            select: 'name',
          },
          {
            path: 'item.actor',
            select: 'name',
          },
        ])
        .lean();

      const totalItems = await this.MovieModel.countDocuments({
        'item.country': country._id,
      });

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: { results, totalPages, totalItems },
      };
    } catch (error) {
      throw new Error(`Cannot get movies by country: ${error.message}`);
    }
  }

  async syncMovie(slug: string) {
    try {
      const baseUrl = this.configService.get<string>('MOVIE_API_URL');

      const { data: movieResponse } = await axios.get(`${baseUrl}/phim/${slug}`);
      const movieData = movieResponse.data;
      if (!movieData) throw new Error('Movie data not found.');

      let peoples = { actors: [], directors: [] };

      if (movieData?.peoples) {
        const { data: peopleResponse } = await axios.get(`${baseUrl}/phim/${slug}/peoples`);
        peoples = peopleResponse.data.peoples || { actors: [], directors: [] };
      }

      const categoryIds = await this.categoryModel
        .find({ _id: { $in: movieData.item.category.map((c) => c.id) } })
        .select('_id')
        .lean<{ _id: Types.ObjectId }>();

      const counTryIds = await this.CountryModel.find({ _id: { $in: movieData.item.country.map((c) => c.id) } })
        .select('_id')
        .lean<{ _id: Types.ObjectId }>();

      const episodesData =
        movieData.item.episodes?.map((ep) => ({
          server_name: ep.server_name,
          is_ai: ep.is_ai,
          server_data: ep.server_data,
        })) || [];

      const savedEpisodes: EpisodesDocument[] = [];
      for (const ep of episodesData) {
        const existing = await this.EpisodesModel.findOne({ server_name: ep.server_name });
        if (existing) {
          existing.is_ai = ep.is_ai;
          existing.server_data = ep.server_data;
          savedEpisodes.push(await existing.save());
        } else {
          const created = await this.EpisodesModel.create(ep);
          savedEpisodes.push(created);
        }
      }
      const episodeIds = savedEpisodes.map((e) => e._id);

      const dto = plainToInstance(CreateMovieDto, {
        seoOnPage: movieData.seoOnPage,
        breadCrumb: movieData.breadCrumb,
        params: movieData.params,
        item: {
          name: movieData.item.name,
          originName: movieData.item.origin_name,
          description: movieData.item.content,
          type: movieData.item.type,
          status: movieData.item.status,
          posterUrl: movieData.item.poster_url,
          thumbUrl: movieData.item.thumb_url,
          trailerUrl: movieData.item.trailer_url,
          time: movieData.item.time,
          episodeCurrent: movieData.item.episode_current,
          episodeTotal: movieData.item.episode_total,
          quality: movieData.item.quality,
          lang: movieData.item.lang,
          year: movieData.item.year,
          actor: [],
          director: [],
          episodes: [],
          category: movieData.item.category?.map((c) => c.name),
          country: movieData.item.country?.map((c) => c.name),
        },
      });
      await validateOrReject(dto);

      const [actors] = await Promise.all([this.ActorService.ensureMany(peoples.actors)]);

      const updateData = {
        slug: movieData.params.slug,
        seoOnPage: movieData.seoOnPage,
        breadCrumb: movieData.breadCrumb,
        params: movieData.params,
        item: {
          name: movieData.item.name,
          originName: movieData.item.origin_name,
          description: movieData.item.content,
          type: movieData.item.type,
          status: movieData.item.status,
          posterUrl: movieData.item.poster_url,
          thumbUrl: movieData.item.thumb_url,
          trailerUrl: movieData.item.trailer_url,
          time: movieData.item.time,
          episodeCurrent: movieData.item.episode_current,
          episodeTotal: movieData.item.episode_total,
          quality: movieData.item.quality,
          lang: movieData.item.lang,
          year: movieData.item.year,
          actor: actors,
          director: [],
          category: categoryIds,
          country: counTryIds,
          episodes: episodeIds,
        },
      };

      const updated = await this.MovieModel.findOneAndUpdate({ slug: movieData.item.slug }, updateData, {
        upsert: true,
        new: true,
      });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  async syncMovieList(slug: string) {
    try {
      const i18n = I18nContext.current();

      const baseUrl = this.configService.get<string>('MOVIE_API_URL');
      const { data: movieResponse } = await axios.get(`${baseUrl}/${slug}`);
      const movieData = movieResponse.data;
      if (!movieData) throw new Error('Movie data not found.');
      for (const movie of movieData.items) {
        await this.syncMovie(movie.slug);
      }
      const message = await i18n.t('movie.GET_SUCCESS');

      return {
        message,
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string) {
    return await this.MovieModel.findOne({ slug });
  }
}
