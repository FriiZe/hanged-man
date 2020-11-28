import { LetterAlreadySuggestedError, WordAlreadySuggestedError } from '@hanged-man/engine';
import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

@Catch(LetterAlreadySuggestedError, WordAlreadySuggestedError)
export class AlreadySuggestedFilter implements WsExceptionFilter {
  public catch(_exception: Error, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>();

    client
      .emit('exception', {
        message: ['this word / letter was already suggested'],
        error: 'Conflict',
      });
  }
}
