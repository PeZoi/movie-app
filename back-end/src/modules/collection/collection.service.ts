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
            {
              $match: {
                $expr: {
                  $eq: ['$item.status', '$$filter.status'],
                },
              },
            },

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

            {
              $lookup: {
                from: 'categories',
                localField: 'item.category',
                foreignField: '_id',
                as: 'categories',
              },
            },

            {
              $addFields: {
                finalSortKey: {
                  $cond: [
                    { $eq: ['$$filter.order', -1] }, // nếu sort giảm dần
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
              $project: {
                'item.name': 1,
                'item.quality': 1,
                'item.year': 1,
                'item.originName': 1,
                'item.type': 1,
                'item.lang': 1,
                'item.time': 1,
                slug: 1,
                'images.image_sizes': 1,
                'images.image': 1,
                'categories.name': 1,
              },
            },

            { $sort: { updated_at: -1 } },
          ],
          as: 'movies',
        },
      },
      { $sort: { order: 1 } },
    ]).exec();

    return {
      data: { results },
    };
  }
}
