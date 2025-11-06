import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  image: string;

  @Prop({ default: 'USER' })
  role: string;

  @Prop({ default: 'Local' })
  accountType: string;

  @Prop({ default: 'Male', type: String, enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
