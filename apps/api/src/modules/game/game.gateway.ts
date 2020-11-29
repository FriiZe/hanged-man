import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';

import { LoggedUserWs } from '../../decorators/logged-user-ws.decorator';
import { AlreadySuggestedFilter } from '../../filters/ws/already-suggested.filter';
import { GameNotFoundFilter } from '../../filters/ws/game-not-found.filter';
import { WsEntityNotFoundFilter } from '../../filters/ws/ws-entity-not-found.filter';
import { WsForbiddenActionFilter } from '../../filters/ws/ws-forbidden-action.filter';
import { AuthWsGuard } from '../../guards/auth-ws.guard';
import { ConfigService } from '../core/services/config.service';
import { GameService } from './game.service';

@UseFilters(
  AlreadySuggestedFilter,
  GameNotFoundFilter,
  WsEntityNotFoundFilter,
  WsForbiddenActionFilter,
)
@WebSocketGateway({ namespace: '/games' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  private readonly server!: Server;

  public constructor(
    private readonly configService: ConfigService,
    private readonly gameService: GameService,
  ) {}

  public handleConnection(client: Socket): void {
    if (this.configService.environment === 'DEVELOPMENT') {
      this.logger.log(`client ${client.id} connected`);
    }

    client.on('game', (gameId: string) => {
      client.join(gameId);
    });
  }

  @UseGuards(AuthWsGuard)
  @SubscribeMessage('play')
  public async play(@MessageBody() data: { gameId: string, input: string }, @LoggedUserWs() userId: string): Promise<void> {
    const result = await this.gameService.play(data.gameId, data.input, userId);

    this.server.to(data.gameId).emit('player-played', result);
  }

  public handleDisconnect(client: Socket): void {
    if (this.configService.environment === 'DEVELOPMENT') {
      this.logger.log(`client ${client.id} disconnected`);
    }

    client.leaveAll();
  }
}
