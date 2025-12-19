import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchGateway } from '@/modules/room/watch.gateway';

import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room, RoomSchema } from '@/modules/room/schemas/room.schemas';

@Module({
  controllers: [RoomController],
  providers: [RoomService, WatchGateway],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])],
})
export class RoomModule {}
