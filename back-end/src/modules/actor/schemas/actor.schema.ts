import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActorDocument = HydratedDocument<Actor>;

@Schema({ timestamps: true })
export class Actor {
  @Prop({ required: true })
  name: string;

  @Prop()
  original_name: string;

  @Prop()
  adult: boolean;

  @Prop({ default: 'Acting' })
  known_for_department: string;

  @Prop()
  profile_path: string;

  @Prop({ default: 'Male', type: String, enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop()
  also_known_as: boolean;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
