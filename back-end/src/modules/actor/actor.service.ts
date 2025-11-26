import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actors } from './schemas/actor.schema';
@Injectable()
export class ActorService {
  constructor(@InjectModel(Actors.name) private ActorModel: Model<Actors>) {}

  create(createActorDto: CreateActorDto) {
    return 'This action adds a new actor';
  }

  findAll() {
    return `This action returns all actor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} actor`;
  }

  update(id: number, updateActorDto: UpdateActorDto) {
    return `This action updates a #${id} actor`;
  }

  remove(id: number) {
    return `This action removes a #${id} actor`;
  }

  async ensureMany(
    actors: {
      tmdb_people_id: number;
      adult: string;
      gender: number;
      gender_name: string;
      name: string;
      original_name: string;
      character: string;
      known_for_department?: string;
      profile_path?: string;
      also_known_as: [];
    }[] = [],
  ): Promise<Types.ObjectId[]> {
    if (!actors.length) return [];

    const validActors = actors.filter((a) => a.name);

    const existingActors = await this.ActorModel.find({
      $or: validActors.map((a) => ({
        $or: [{ tmdb_people_id: a.tmdb_people_id }, { name: a.name }],
      })),
    }).lean();

    const existingMap = new Map<string | number, any>();
    existingActors.forEach((actor) => {
      if (actor.actor_id) existingMap.set(actor.actor_id, actor);
      if (actor.name) existingMap.set(actor.name.toLowerCase(), actor);
    });

    const newActorsData = [];
    const ids: Types.ObjectId[] = [];

    for (const actor of validActors) {
      const found = existingMap.get(actor?.tmdb_people_id) || existingMap.get(actor.name.toLowerCase());

      if (found) {
        ids.push(found._id);
      } else {
        newActorsData.push({
          actor_id: actor.tmdb_people_id,
          name: actor.name,
          adult: actor.adult,
          gender: actor.gender,
          gender_name: actor.gender_name,
          original_name: actor.original_name,
          also_known_as: actor.also_known_as || [],
          character: actor.character || '',
          known_for_department: actor.known_for_department || 'Acting',
          profile_path: actor.profile_path || '',
        });
      }
    }

    if (newActorsData.length) {
      const newActors = await this.ActorModel.insertMany(newActorsData);
      ids.push(...newActors.map((a) => a._id));
    }

    return ids;
  }
}
