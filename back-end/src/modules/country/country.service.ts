import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { I18nContext } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { generateSlug } from '@/helper/util';
import { Country } from './schemas/country.schema';

@Injectable()
export class CountryService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const i18n = I18nContext.current();
    const { name } = createCountryDto;
    const slug = await generateSlug(name);
    const isCountryExist = await this.isCountryExist(slug);
    if (isCountryExist) {
      throw new BadRequestException(i18n.t('country.COUNTRY_EXIST'));
    }

    const country = await this.countryModel.create({
      name: name?.toLowerCase(),
      slug,
    });

    if (!country) {
      throw new BadRequestException(i18n.t('country.CREATE_FAIL'));
    }
    const message = await i18n.t('constant.CREATE_SUCCESS');
    return {
      message,
      data: {
        result: { _id: country._id },
      },
    };
  }

  async findAll() {
    const i18n = I18nContext.current();

    const result = await this.countryModel.find({});
    const message = await i18n.t('constant.GET_DATA_SUCCESS');
    return {
      message,
      data: {
        result,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }

  async isCountryExist(slug: string) {
    const country = await this.countryModel.exists({ slug });
    if (country) return true;
    return false;
  }
}
