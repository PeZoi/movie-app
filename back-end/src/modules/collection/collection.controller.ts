import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('create')
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get('list')
  async getCollections(@Query('page') page: number = 1, @Query('limit') limit: number = 4) {
    return this.collectionService.getCollections(page, limit);
  }
}
