import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter<EntityNotFoundError> {
  public catch(exception: EntityNotFoundError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;

    response
      .status(status)
      .json({
        statusCode: status,
        message: ['the requested entity was not found'],
        error: 'Not Found',
      });
  }
}
