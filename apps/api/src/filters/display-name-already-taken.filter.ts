import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { DisplayNameAlreadyTakenError } from '../modules/player/errors/display-name-already-taken.error';

@Catch(DisplayNameAlreadyTakenError)
export class DisplayNameAlreadyTakenFilter implements ExceptionFilter<DisplayNameAlreadyTakenError> {
  public catch(exception: DisplayNameAlreadyTakenError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;

    response
      .status(status)
      .json({
        statusCode: status,
        message: [exception.message],
        error: 'Not Found',
      });
  }
}
