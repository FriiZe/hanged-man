import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

import { GameNotFoundError } from '../../modules/game/errors/game-not-found.error';

@Catch(GameNotFoundError)
export class GameNotFoundFilter implements WsExceptionFilter {
  public catch(exception: GameNotFoundError, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>();

    client
      .emit('exception', {
        message: [exception.message],
        error: 'Not Found',
      });
  }
}
