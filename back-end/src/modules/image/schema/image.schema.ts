import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImagesDocument = HydratedDocument<Images>;

@Schema()
class Backdrop {
  @Prop()
  original: string;

  @Prop()
  w1280: string;

  @Prop()
  w300: string;

  @Prop()
  w780: string;
}

@Schema()
class Poster {
  @Prop()
  original: string;

  @Prop()
  w154: string;

  @Prop()
  w342: string;

  @Prop()
  w500: string;

  @Prop()
  w780: string;

  @Prop()
  w92: string;
}

@Schema()
class ImageSizes {
  @Prop({ type: Backdrop })
  backdrop: Backdrop;

  @Prop({ type: Poster })
  poster: Poster;
}

@Schema()
class Image {
  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  aspect_radio: string;

  @Prop()
  type: string;

  @Prop()
  file_path: string;

  @Prop()
  iso_639_1?: string;
}

@Schema({ timestamps: true })
export class Images {
  @Prop()
  tmdb_id: number;

  @Prop()
  tmdb_type: string;

  @Prop()
  tmdb_season: number;

  @Prop()
  slug: string;

  @Prop()
  imdb_id: string;

  @Prop({ type: ImageSizes })
  image_sizes: ImageSizes;

  @Prop({ type: [Image], default: [] })
  images: Image[];
}

export const ImageSchema = SchemaFactory.createForClass(Images);
