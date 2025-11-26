import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: Number, unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
