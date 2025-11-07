import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model, Types } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

import { Category } from './schemas/category.schema';
import { generateSlug } from '@/helper/util';

@Injectable()
export class CategoryService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const i18n = I18nContext.current();
    const { name } = createCategoryDto;
    const slug = await generateSlug(name);
    const isCountryExist = await this.isCategoryExist(slug);
    if (isCountryExist) {
      throw new BadRequestException(i18n.t('category.CATEGORY_EXIST'));
    }

    const category = await this.CategoryModel.create({
      name: name?.toLowerCase(),
      slug,
    });

    if (!category) {
      throw new BadRequestException(i18n.t('constant.CREATE_FAIL'));
    }
    const message = await i18n.t('constant.CREATE_SUCCESS');
    return {
      message,
      data: {
        result: { _id: category._id },
      },
    };
  }

  async findAll() {
    const i18n = I18nContext.current();

    const result = await this.CategoryModel.find({});
    const message = await i18n.t('constant.GET_DATA_SUCCESS');
    return {
      message,
      data: {
        result,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async fetchAndSaveCountries() {
    const url = 'https://ophim1.com/v1/api/the-loai';

    const response = await firstValueFrom(this.httpService.get(url));
    const countries = response.data?.data?.items || [];

    for (const item of countries) {
      const objectId = new Types.ObjectId(item._id);
      await this.CategoryModel.updateOne(
        { _id: objectId },
        { $set: { name: item.name, slug: item.slug } },
        { upsert: true },
      );
    }

    return { message: 'Countries synced successfully', count: countries.length };
  }

  async isCategoryExist(slug: string) {
    const country = await this.CategoryModel.exists({ slug });
    if (country) return true;
    return false;
  }
}
