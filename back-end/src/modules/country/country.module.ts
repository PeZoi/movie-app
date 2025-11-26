import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { HttpModule } from '@nestjs/axios';
import { CountryController } from './country.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './schemas/country.schema';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])],
})
export class CountryModule {}
