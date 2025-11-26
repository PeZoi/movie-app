import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Actors, ActorSchema } from './schemas/actor.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Actors.name, schema: ActorSchema }])],
  controllers: [ActorController],
  providers: [ActorService],
  exports: [ActorService],
})
export class ActorModule {}
