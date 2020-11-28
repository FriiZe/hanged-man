import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(EntityNotFoundError)
export class WsEntityNotFoundFilter implements WsExceptionFilter {
  public catch(_exception: EntityNotFoundError, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>();

    client
      .emit('exception', {
        message: ['the requested entity was not found'],
        error: 'Not Found',
      });
  }
}
