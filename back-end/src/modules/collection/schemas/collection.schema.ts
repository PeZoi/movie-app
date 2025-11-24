import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, index: true, required: true })
  slug: string;

  @Prop({ default: '#ffffff' })
  color: string;

  @Prop({ default: 1 })
  order: number;

  @Prop({ default: 1 })
  style: number;

  @Prop({ default: false })
  random_data: boolean;

  @Prop({ required: true })
  type: number;

  @Prop({ type: Object })
  filter: Record<string, any>;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
