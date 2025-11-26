import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Categorys, CategorySchema } from './schemas/category.schema';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Categorys.name, schema: CategorySchema }])],
})
export class CategoryModule {}
