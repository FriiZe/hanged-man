import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { UsernameAlreadyTakenError } from '../../modules/auth/errors/username-already-taken.error';

@Catch(UsernameAlreadyTakenError)
export class UsernameAlreadyTakenFilter implements ExceptionFilter<UsernameAlreadyTakenError> {
  public catch(exception: UsernameAlreadyTakenError, host: ArgumentsHost): void {
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
