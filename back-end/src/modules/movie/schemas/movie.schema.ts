import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Actor } from '@/modules/actor/schemas/actor.schema';
import { Category } from '@/modules/category/schemas/category.schema';
import { Country } from '@/modules/country/schemas/country.schema';
import { Episodes } from '@/modules/episodes/schema/episodes.schema';
import { Images } from '@/modules/image/schema/image.schema';

@Schema({ _id: false })
class Imdb {
  @Prop() id: string;
  @Prop() vote_average: number;
  @Prop() vote_count: number;
}

@Schema({ _id: false })
class Created {
  @Prop() time: string;
}

@Schema({ _id: false })
class Modified {
  @Prop() time: string;
}

@Schema({ _id: false })
class SeoSchema {
  @Prop() ['@context']: string;
  @Prop() ['@type']: string;
  @Prop() name: string;
  @Prop() dateModified: string;
  @Prop() dateCreated: string;
  @Prop() url: string;
  @Prop() datePublished: string;
  @Prop() image: string;
  @Prop() director: string;
}

@Schema({ _id: false })
class SeoOnPage {
  @Prop() og_type: string;
  @Prop() titleHead: string;
  @Prop({ type: SeoSchema }) seoSchema: SeoSchema;
  @Prop() descriptionHead: string;
  @Prop([String]) og_image: string[];
  @Prop() updated_time: number;
  @Prop() og_url: string;
}

@Schema({ _id: false })
class BreadCrumb {
  @Prop() name: string;
  @Prop() slug?: string;
  @Prop() position: number;
  @Prop() isCurrent?: boolean;
}

@Schema({ _id: false })
class Params {
  @Prop() slug: string;
}

@Schema({ _id: false })
class MovieItem {
  @Prop({ required: true }) name: string;
  @Prop() originName?: string;
  @Prop() description?: string;
  @Prop() type?: string;
  @Prop({ default: 'ongoing' }) status?: string;
  @Prop() movie_id?: string;
  @Prop() posterUrl?: string;
  @Prop() thumbUrl?: string;
  @Prop() trailerUrl?: string;
  @Prop() time?: string;
  @Prop() episodeCurrent?: string;
  @Prop() episodeTotal?: string;
  @Prop() quality?: string;
  @Prop() lang?: string;
  @Prop() notify?: string;
  @Prop() showtimes?: string;
  @Prop() isCopyright?: boolean;
  @Prop() subDocQuyen?: boolean;
  @Prop() chieuRap?: boolean;
  @Prop() year?: number;
  @Prop() view?: number;

  @Prop({ type: Imdb }) imdb: Imdb;
  @Prop({ type: Created }) created?: Created;
  @Prop({ type: Modified }) modified?: Modified;

  @Prop({ type: [{ type: Types.ObjectId, ref: Actor.name }], default: [] })
  actor?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Category.name }], default: [] })
  category?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Country.name }], default: [] })
  country?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Episodes.name }], default: [] })
  episodes?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Images.name }], default: [] })
  images?: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Movie extends Document {
  @Prop()
  slug: string;

  @Prop({ type: SeoOnPage })
  seoOnPage: SeoOnPage;

  @Prop({ type: [BreadCrumb] })
  breadCrumb: BreadCrumb[];

  @Prop({ type: Params })
  params: Params;

  @Prop({ type: MovieItem })
  item: MovieItem;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
