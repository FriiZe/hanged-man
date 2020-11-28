import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

import { LoggedUserWs } from '../../decorators/logged-user-ws.decorator';
import { AlreadySuggestedFilter } from '../../filters/ws/already-suggested.filter';
import { GameNotFoundFilter } from '../../filters/ws/game-not-found.filter';
import { WsEntityNotFoundFilter } from '../../filters/ws/ws-entity-not-found.filter';
import { WsForbiddenActionFilter } from '../../filters/ws/ws-forbidden-action.filter';
import { AuthWsGuard } from '../../guards/auth-ws.guard';
import { ConfigService } from '../core/services/config.service';
import { GameDto } from './dtos/game.dto';
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
  public async play(@MessageBody() data: { gameId: string, input: string }, @LoggedUserWs() userId: string): Promise<GameDto> {
    const result = await this.gameService.play(data.gameId, data.input, userId);

    return result;
  }

  public handleDisconnect(client: Socket): void {
    if (this.configService.environment === 'DEVELOPMENT') {
      this.logger.log(`client ${client.id} disconnected`);
    }

    client.leaveAll();
  }
}
