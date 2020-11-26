import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import BadCodeError from '../modules/room/errors/bad-code.error';

@Catch(BadCodeError)
export class BadCodeFilter implements ExceptionFilter<BadCodeError> {
  public catch(exception: BadCodeError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.FORBIDDEN;

    response
      .status(status)
      .json({
        statusCode: status,
        message: [exception.message],
        error: 'Forbidden',
      });
  }
}
