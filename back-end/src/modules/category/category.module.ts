import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
})
export class CategoryModule {}
