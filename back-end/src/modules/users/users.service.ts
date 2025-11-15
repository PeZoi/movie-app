import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helper/util';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  i18n = I18nContext.current();

  async create(createUserDto: CreateUserDto) {
    const i18n = I18nContext.current();
    const { name, email, password, gender, avata } = createUserDto;

    //check email exist
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(i18n.t('auth.EMAIL_EXIST'));
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      gender,
      avata,
    });

    const message = await i18n.t('auth.REGISTER_SUCCESS');
    return {
      message,
      data: {
        result: { _id: user._id },
      },
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter?.current) delete filter.current;
    if (filter?.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return {
      message: await I18nContext.current().t('user.GET_USERS_SUCCESS'),
      data: { results, totalPages },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { name, image, gender } = updateUserDto;
    const result = await this.userModel.updateOne({ _id: updateUserDto._id }, { name, image, gender });

    if (result.matchedCount === 0) {
      throw new BadRequestException(I18nContext.current().t('user.USER_NOT_FOUND'));
    }
    return {
      message: await I18nContext.current().t('user.UPDATE_SUCCESS'),
      data: {},
    };
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      const result = await this.userModel.deleteOne({ _id });
      if (result.deletedCount === 0) {
        throw new BadRequestException(I18nContext.current().t('user.USER_NOT_FOUND'));
      }
      return {
        message: await I18nContext.current().t('user.DELETE_SUCCESS'),
        data: {},
      };
    } else {
      throw new BadRequestException(I18nContext.current().t('validator.ID_INVALID'));
    }
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async isEmailExist(email: string) {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }
}
