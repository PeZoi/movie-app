// src/rooms/watch.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { RoomService } from './room.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WatchGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly RoomService: RoomService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;

      const payload = jwt.verify(token, this.configService.get<string>('JWT_SECRET')) as any;
      client.data.userId = payload.sub;
      client.data.email = payload.email;

      console.log('Socket connected:', client.id);
    } catch (err) {
      console.log('Socket auth failed');
      client.disconnect();
    }
  }

  @SubscribeMessage('room:join')
  async join(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const data1 = Array.isArray(data) ? data[0] : data;
    const roomId = data1?.roomId;
    console.log('room:join', roomId);

    const room = await this.RoomService.findById(roomId);
    if (!room) {
      client.emit('error', { message: 'Room không tồn tại' });
      return;
    }

    client.join(data.roomId);

    await this.RoomService.joinRoom(data.roomId, client.data.userId);

    this.server.to(data.roomId).emit('room:user-joined', {
      userId: client.data.userId,
      hostId: room.host_id.toString(),
    });
  }

  // ===== LEAVE ROOM =====
  @SubscribeMessage('room:leave')
  async leave(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    await this.RoomService.leaveRoom(data.roomId, client.data.userId);
    client.leave(data.roomId);
  }

  @SubscribeMessage('chat:send')
  chat(@ConnectedSocket() client: Socket, @MessageBody() data) {
    this.server.to(data.roomId).emit('chat:new', {
      userId: client.data.userId,
      username: client.data.username,
      message: data.message,
      createdAt: new Date(),
    });
  }
}
