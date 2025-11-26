import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Countrys>;

@Schema({ timestamps: true })
export class Countrys {
  @Prop()
  name: string;

  @Prop()
  slug: string;
}

export const CountrySchema = SchemaFactory.createForClass(Countrys);
