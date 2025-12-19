import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomDocument } from '@/modules/room/schemas/room.schemas';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}
  async create(createRoomDto: CreateRoomDto, userId: string) {
    const existedRoom = await this.roomModel.findOne({
      host_id: userId,
      movie_id: createRoomDto.movie_id,
    });

    if (existedRoom) {
      throw new BadRequestException('Host đã tạo room cho phim này rồi');
    }

    const result = await this.roomModel.create({
      ...createRoomDto,
      movie_id: new Types.ObjectId(createRoomDto.movie_id),
      host_id: new Types.ObjectId(userId),
      users: [new Types.ObjectId(userId)],
      last_active: new Date(),
    });

    return {
      data: {
        result: [result],
      },
    };
  }

  async joinRoom(room_id: string, userId: string) {
    if (!Types.ObjectId.isValid(room_id)) {
      throw new BadRequestException('Room id không hợp lệ');
    }
    const existedRoom = await this.roomModel.findOne({
      _id: room_id,
    });

    if (!existedRoom) {
      throw new BadRequestException('Phòng không tồn tại');
    }

    const result = await this.roomModel.findOneAndUpdate(
      { _id: room_id },
      {
        $addToSet: { users: new Types.ObjectId(userId) },
        $set: { last_active: new Date() },
      },
      { new: true },
    );

    return {
      data: {
        result: [result],
      },
    };
  }

  async leaveRoom(room_id: string, userId: string) {
    if (!Types.ObjectId.isValid(room_id)) {
      throw new BadRequestException('Room id không hợp lệ');
    }
    const existedRoom = await this.roomModel.findOne({
      _id: room_id,
    });

    if (!existedRoom) {
      throw new BadRequestException('Phòng không tồn tại');
    }

    const result = await this.roomModel.findOneAndUpdate(
      { _id: room_id },
      {
        $pull: { users: new Types.ObjectId(userId) },
        $set: { last_active: new Date() },
      },
      { new: true },
    );

    if (result && result.host_id.toString() === userId && result.users.length > 0) {
      result.host_id = result.users[0];
      await result.save();
    }

    return {
      data: {
        result: [result],
      },
    };
  }

  async findById(id: string) {
    return this.roomModel.findById({ _id: id });
  }

  findAll() {
    return `This action returns all room`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
