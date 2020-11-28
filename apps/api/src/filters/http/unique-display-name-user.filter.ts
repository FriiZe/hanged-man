import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { UniqueDisplayNameUserError } from '../../modules/player/errors/unique-display-name-user.error';

@Catch(UniqueDisplayNameUserError)
export class UniqueDisplayNameUserFilter implements ExceptionFilter<UniqueDisplayNameUserError> {
  public catch(exception: UniqueDisplayNameUserError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.CONFLICT;

    response
      .status(status)
      .json({
        statusCode: status,
        message: [exception.message],
        error: 'Conflict',
      });
  }
}
