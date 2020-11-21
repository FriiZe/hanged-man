import {
  OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/rooms' })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  public handleConnection(client: Socket): void {
    client.on('room', (roomId: string) => {
      client.join(roomId);
    });
  }

  public handleDisconnect(client: Socket): void {
    client.leaveAll();
  }

  public playerJoined(roomId: string, playerId: string): void {
    this.server.to(roomId).emit('player-joined', { playerId });
  }

  public playerLeft(roomId: string, playerId: string): void {
    this.server.to(roomId).emit('player-left', { playerId });
  }
}
