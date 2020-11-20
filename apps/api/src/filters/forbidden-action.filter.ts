import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { ForbiddenActionError } from '../common/errors/forbidden-action.error';

@Catch(ForbiddenActionError)
export class ForbiddenActionFilter implements ExceptionFilter<ForbiddenActionError> {
  public catch(exception: ForbiddenActionError, host: ArgumentsHost): void {
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
