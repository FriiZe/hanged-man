import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { BadCredentialsError } from '../../modules/auth/errors/bad-credentials.error';

@Catch(BadCredentialsError)
export class BadCredentialsFilter implements ExceptionFilter<BadCredentialsError> {
  public catch(exception: BadCredentialsError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.UNAUTHORIZED;

    response
      .status(status)
      .json({
        statusCode: status,
        message: [exception.message],
        error: 'Unauthorized',
      });
  }
}
