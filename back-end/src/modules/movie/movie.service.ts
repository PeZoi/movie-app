import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

import { CreateMovieDto } from './dto/create-movie.dto';
import axios from 'axios';
import { Movie } from './schemas/movie.schema';
import { ActorService } from '../actor/actor.service';
import { Category } from '@/modules/category/schemas/category.schema';
import { Country } from '@/modules/country/schemas/country.schema';
import { Episodes } from '@/modules/episodes/schema/episodes.schema';
import { Images } from '@/modules/image/schema/image.schema';
import { Actor } from '@/modules/actor/schemas/actor.schema';
import { MovieFilterDto } from '@/modules/movie/dto/filter-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private MovieModel: Model<Movie>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Country.name) private CountryModel: Model<Country>,
    @InjectModel(Episodes.name) private EpisodesModel: Model<Episodes>,
    @InjectModel(Images.name) private ImagesModel: Model<Images>,
    @InjectModel(Actor.name) private ActorModel: Model<Actor>,
    private readonly ActorService: ActorService,
    private readonly configService: ConfigService,
  ) {}

  async getMovieByCategory(slug: string, current: number, pageSize: number) {
    try {
      const i18n = I18nContext.current();
      if (!current) current = 1;
      if (!pageSize) pageSize = 10;

      const category = await this.categoryModel.findOne({ slug }).select('_id').lean();
      if (!category) throw new BadRequestException(i18n.t('category.CATEGORY_NOT_FOUND'));
      const skip = (current - 1) * pageSize;

      const result = await this.MovieModel.find({
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
        data: { result, totalPages, totalItems },
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

      const result = await this.MovieModel.find({
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
        data: { result, totalPages, totalItems },
      };
    } catch (error) {
      throw new Error(`Cannot get movies by country: ${error.message}`);
    }
  }

  async getMovieByActor(_id: string) {
    try {
      const i18n = I18nContext.current();

      const actor = await this.ActorModel.findOne({ _id }).select('_id').lean();
      if (!actor) throw new BadRequestException(i18n.t('country.COUNTRY_NOT_FOUND'));

      const result = await this.MovieModel.find({
        'item.actor': actor._id,
      })
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
        'item.country': actor._id,
      });

      return {
        data: { result },
      };
    } catch (error) {
      throw new Error(`Cannot get movies by country: ${error.message}`);
    }
  }

  async getMovieBySlug(slug: string) {
    const i18n = I18nContext.current();

    let result;

    try {
      result = await this.MovieModel.findOne({ slug })
        .populate([
          { path: 'item.episodes' },
          { path: 'item.country' },
          { path: 'item.category' },
          { path: 'item.actor' },
          { path: 'item.images' },
        ])
        .lean();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!result) {
      throw new NotFoundException(i18n.t('movie.MOVIE_NOT_FOUND'));
    }

    return {
      message: await i18n.t('movie.GET_SUCCESS'),
      data: { result },
    };
  }

  async getMovieFilter(dto: MovieFilterDto) {
    const { countries, categories, years, type, rating, sort = 'updated_at', page = 1, pageSize = 20 } = dto;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const parseList = (str) => (str ? str.split(',').filter(Boolean) : []);

    const countryArr = parseList(countries);
    const categoriArr = parseList(categories);
    const yearArr = parseList(years).map((y) => Number(y));

    const sortField = sort === 'year' ? 'item.year' : sort === 'created_at' ? 'createdAt' : 'updatedAt';

    const result = await this.MovieModel.aggregate([
      { $lookup: { from: 'countries', localField: 'item.country', foreignField: '_id', as: 'country_info' } },
      { $unwind: '$country_info' },
      {
        $lookup: {
          from: 'categories',
          localField: 'item.category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'images',
          localField: 'item.images',
          foreignField: '_id',
          as: 'images',
        },
      },
      {
        $addFields: {
          filterCountries: countryArr,
          filterCategories: categoriArr,
          filterYears: yearArr,
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              // COUNTRY FILTER
              {
                $cond: [
                  { $gt: [{ $size: '$filterCountries' }, 0] },
                  { $in: ['$country_info.slug', '$filterCountries'] },
                  true,
                ],
              },

              // CATEGORY FILTER
              {
                $cond: [
                  { $gt: [{ $size: '$filterCategories' }, 0] },
                  {
                    $gt: [
                      {
                        $size: {
                          $setIntersection: ['$category.slug', '$filterCategories'],
                        },
                      },
                      0,
                    ],
                  },
                  true,
                ],
              },

              // YEAR FILTER

              {
                $cond: [{ $gt: [{ $size: '$filterYears' }, 0] }, { $in: ['$item.year', '$filterYears'] }, true],
              },
              ...(type ? [{ $eq: ['$item.type', type] }] : [{ $or: [true] }]),
            ],
          },
        },
      },

      // RANDOM ONLY IMAGE
      {
        $addFields: {
          images: {
            $map: {
              input: '$images',
              as: 'imgDoc',
              in: {
                $mergeObjects: [
                  '$$imgDoc',
                  {
                    image: {
                      $let: {
                        vars: {
                          onlyBackdrop: {
                            $filter: {
                              input: '$$imgDoc.images',
                              as: 'img',
                              cond: { $eq: ['$$img.type', 'backdrop'] },
                            },
                          },
                        },
                        in: {
                          $arrayElemAt: [
                            '$$onlyBackdrop',
                            { $floor: { $multiply: [{ $rand: {} }, { $size: '$$onlyBackdrop' }] } },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },

      { $sort: { [sortField]: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $project: {
          item: 1,
          slug: 1,
          'category.slug': 1,
          'category.name': 1,
          'images.image_sizes': 1,
          'images.image': 1,
        },
      },
      {
        $unset: ['item.actor', 'item.category', 'item.country', 'item.images', 'item.episodes'],
      },
    ]);

    const totalItems = await result.length;

    return {
      data: { result, totalItems },
    };
  }

  async syncMovie(slug: string) {
    try {
      const baseUrl = this.configService.get<string>('MOVIE_API_URL');

      const { data: movieResponse } = await axios.get(`${baseUrl}/phim/${slug}`);
      const movieData = movieResponse.data;
      if (!movieData) throw new Error('Movie data not found.');

      let peoples = [];
      try {
        const { data: peopleResponse } = await axios.get(`${baseUrl}/phim/${slug}/peoples`);
        console.log('🚀 ~ MovieService ~ syncMovie ~ data:', peopleResponse);
        if (peopleResponse?.success) {
          peoples = peopleResponse.data.peoples || [];
        } else {
          console.log(`API peoples của phim ${slug}: false`);
        }
      } catch (error: any) {}
      const { data: imageResponse } = await axios.get(`${baseUrl}/phim/${slug}/images `);
      const imageData = imageResponse.data;

      if (!imageData) {
        throw new Error('Image data not found.');
      }

      const existingImage = await this.ImagesModel.findOne({ slug });

      let savedImageDoc;
      if (existingImage) {
        existingImage.tmdb_id = imageData.tmdb_id;
        existingImage.tmdb_type = imageData.tmdb_type;
        existingImage.tmdb_season = imageData.tmdb_season;
        existingImage.slug = imageData.slug || slug;
        existingImage.imdb_id = imageData.imdb_id;
        existingImage.image_sizes = imageData.image_sizes;
        existingImage.images = imageData.images;

        savedImageDoc = await existingImage.save();
      } else {
        savedImageDoc = await this.ImagesModel.create({
          ...imageData,
          slug,
        });
      }

      const imageId = savedImageDoc._id;

      const categoryIds = await this.categoryModel
        .find({ _id: { $in: movieData.item.category.map((c) => c.id) } })
        .select('_id')
        .lean();

      const counTryIds = await this.CountryModel.find({ _id: { $in: movieData.item.country.map((c) => c.id) } })
        .select('_id')
        .lean();

      const episodesData =
        movieData.item.episodes?.map((ep) => ({
          server_name: ep.server_name,
          is_ai: ep.is_ai,
          server_data: ep.server_data,
        })) || [];

      const episodesDataWithSlug = episodesData.map((ep) => ({
        ...ep,
        movie_slug: movieData.item.slug,
      }));

      const savedEpisodes = [];
      for (const ep of episodesDataWithSlug) {
        const existing = await this.EpisodesModel.findOne({ movie_slug: ep.movie_slug });
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
          imdb: movieData.item.imdb,
          actor: [],
          director: [],
          episodes: [],
          images: [],
          category: movieData.item.category?.map((c) => c.name),
          country: movieData.item.country?.map((c) => c.name),
        },
      });
      await validateOrReject(dto);

      const actors = peoples.length > 0 ? await this.ActorService.ensureMany(peoples) : [];

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
          imdb: movieData.item.imdb,
          actor: actors,
          director: [],
          category: categoryIds,
          country: counTryIds,
          episodes: episodeIds,
          images: imageId,
        },
      };

      const updated = await this.MovieModel.findOneAndUpdate({ slug: movieData.item.slug }, updateData, {
        upsert: true,
        new: true,
      });

      return updated;
    } catch (error) {
      // throw error;
    }
  }

  async syncMovieList(slug: string) {
    try {
      const i18n = I18nContext.current();

      const baseUrl = this.configService.get<string>('MOVIE_API_URL');
      const { data: movieResponse } = await axios.get(`${baseUrl}/danh-sach/${slug}`);
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
