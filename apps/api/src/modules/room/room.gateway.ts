import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';

import { ConfigService } from '../core/services/config.service';

@WebSocketGateway({ namespace: '/rooms' })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RoomGateway.name);

  @WebSocketServer()
  private readonly server!: Server;

  public constructor(
    private readonly configService: ConfigService,
  ) {}

  public handleConnection(client: Socket): void {
    if (this.configService.environment === 'DEVELOPMENT') {
      this.logger.log(`client ${client.id} connected`);
    }

    client.on('room', (roomId: string) => {
      client.join(roomId);
    });
  }

  public playerJoined(roomId: string, playerId: string): void {
    this.server.to(roomId).emit('player-joined', { playerId });
  }

  public playerLeft(roomId: string, playerId: string): void {
    this.server.to(roomId).emit('player-left', { playerId });
  }

  public gameCreated(roomId: string, gameId: string): void {
    this.server.to(roomId).emit('game-created', { gameId });
  }

  public roomCreated(roomId: string): void {
    this.server.emit('room-created', { roomId });
  }

  public roomDeleted(roomId: string): void {
    this.server.emit('room-deleted', { roomId });
  }

  public handleDisconnect(client: Socket): void {
    if (this.configService.environment === 'DEVELOPMENT') {
      this.logger.log(`client ${client.id} disconnected`);
    }

    client.leaveAll();
  }
}
