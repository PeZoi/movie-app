import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Public } from '@/decorator/customize';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('create')
  @Public()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get('list')
  @Public()
  async getCollections(@Query('current') current: number = 1, @Query('pageSize') pageSize: number = 4) {
    return this.collectionService.getCollections(current, pageSize);
  }
}
