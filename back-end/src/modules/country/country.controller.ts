import { Controller, Get, Post, Body } from '@nestjs/common';

import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Public } from '@/decorator/customize';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @Public()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.countryService.findAll();
  }
}
