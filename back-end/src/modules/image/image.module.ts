import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Images, ImageSchema } from '@/modules/image/schema/image.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Images.name, schema: ImageSchema }])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
