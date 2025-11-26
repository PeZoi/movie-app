import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { HttpModule } from '@nestjs/axios';
import { CountryController } from './country.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Countrys, CountrySchema } from './schemas/country.schema';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Countrys.name, schema: CountrySchema }])],
})
export class CountryModule {}
