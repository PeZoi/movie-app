import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  create(@Body() createRoomDto: CreateRoomDto, @Req() req) {
    const userId = req.user.id;
    return this.roomService.create(createRoomDto, userId);
  }

  @Post('joinRoom')
  joinRoom(@Body('room_id') room_id: string, @Req() req) {
    const userId = req.user.id;
    return this.roomService.joinRoom(room_id, userId);
  }

  @Post('leaveRoom')
  leaveRoom(@Body('room_id') room_id: string, @Req() req) {
    const userId = req.user.id;
    return this.roomService.leaveRoom(room_id, userId);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
