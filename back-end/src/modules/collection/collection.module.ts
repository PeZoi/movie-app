import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection, CollectionSchema } from '@/modules/collection/schemas/collection.schema';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }])],
})
export class CollectionModule {}
