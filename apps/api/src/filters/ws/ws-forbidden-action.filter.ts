import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

import { ForbiddenActionError } from '../../common/errors/forbidden-action.error';

@Catch(ForbiddenActionError)
export class WsForbiddenActionFilter implements WsExceptionFilter {
  public catch(exception: ForbiddenActionError, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>();

    client
      .emit('exception', {
        message: [exception.message],
        error: 'Forbidden',
      });
  }
}
