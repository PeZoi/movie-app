import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { I18nContext } from 'nestjs-i18n';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from '@/modules/collection/schemas/collection.schema';
import { generateSlug } from '@/helper/util';

@Injectable()
export class CollectionService {
  constructor(@InjectModel(Collection.name) private CollectionModel: Model<Collection>) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const i18n = I18nContext.current();

    const slug = await generateSlug(createCollectionDto.name);
    const exist = await this.CollectionModel.exists({ slug });
    if (exist) {
      throw new BadRequestException(i18n.t('category.CATEGORY_EXIST'));
    }

    const created = await this.CollectionModel.create({ ...createCollectionDto, slug });

    const message = await i18n.t('constant.CREATE_SUCCESS');
    return {
      message,
      data: {
        result: { _id: created._id },
      },
    };
  }

  async getCollections(page, limit) {
    const skip = (page - 1) * limit;

    const results = await this.CollectionModel.aggregate([
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          movies: { $slice: ['$moviesFull', '$limitInt'] },
          limitInt: {
            $toInt: {
              $ifNull: ['$filter.limit', 20],
            },
          },
        },
      },

      {
        $lookup: {
          from: 'movies',
          let: { filter: '$filter', limitInt: '$limitInt' },

          pipeline: [
            // status
            {
              $match: {
                $expr: {
                  $in: ['$item.status', '$$filter.status'],
                },
              },
            },

            // country
            {
              $lookup: {
                from: 'countries',
                localField: 'item.country',
                foreignField: '_id',
                as: 'country_info',
              },
            },

            {
              $addFields: {
                country_slug: {
                  $arrayElemAt: ['$country_info.slug', 0],
                },
              },
            },

            {
              $match: {
                $expr: {
                  $in: ['$country_slug', '$$filter.country_code'],
                },
              },
            },

            // category
            {
              $lookup: {
                from: 'categories',
                localField: 'item.category',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $match: {
                $expr: {
                  $cond: [
                    {
                      $gt: [{ $size: { $ifNull: ['$$filter.genre_ids', []] } }, 0],
                    },
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [{ $ifNull: ['$category.slug', []] }, '$$filter.genre_ids'],
                          },
                        },
                        0,
                      ],
                    },
                    true,
                  ],
                },
              },
            },

            // image
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
                                  {
                                    $floor: {
                                      $multiply: [{ $rand: {} }, { $size: '$$onlyBackdrop' }],
                                    },
                                  },
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

            // sort
            {
              $addFields: {
                finalSortKey: {
                  $cond: [
                    { $eq: ['$$filter.order', -1] },
                    {
                      $cond: [
                        { $in: ['$$filter.sort_by', ['updatedAt', 'createdAt']] },
                        '$sortField',
                        { $multiply: ['$sortField', -1] },
                      ],
                    },
                    '$sortField',
                  ],
                },
              },
            },

            {
              $sort: { finalSortKey: 1 },
            },

            // limit filter
            {
              $group: {
                _id: null,
                movies: { $push: '$$ROOT' },
              },
            },
            {
              $project: {
                movies: { $slice: ['$movies', '$$limitInt'] },
              },
            },
            { $unwind: '$movies' },
            { $replaceRoot: { newRoot: '$movies' } },
            {
              $unset: [
                'item.actor',
                'item.category',
                'item.country',
                'item.episodes',
                'item.images',
                'item.description',
                'limitInt',
              ],
            },
            {
              $project: {
                item: 1,
                slug: 1,
                'category.name': 1,
                'category.slug': 1,
                'images.image_sizes': 1,
                'images.image': 1,
              },
            },

            { $sort: { updated_at: -1 } },
          ],
          as: 'movies',
        },
      },
      {
        $unset: 'limitInt',
      },
      {
        $addFields: {
          totalItem: { $size: '$movies' },
        },
      },
      { $sort: { order: 1 } },
    ]).exec();

    return {
      data: { results },
    };
  }
}
