import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActorDocument = HydratedDocument<Actors>;

@Schema({ timestamps: true })
export class Actors {
  @Prop({ unique: true })
  actor_id: number;

  @Prop()
  name: string;

  @Prop()
  gender: number;

  @Prop()
  original_name: string;

  @Prop()
  adult: boolean;

  @Prop({ default: 'Acting' })
  known_for_department: string;

  @Prop()
  profile_path: string;

  @Prop({ default: 'Male', type: String })
  gender_name: string;

  @Prop()
  also_known_as: [];
}

export const ActorSchema = SchemaFactory.createForClass(Actors);
