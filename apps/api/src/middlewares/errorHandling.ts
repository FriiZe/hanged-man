import { NextFunction, Request, Response } from 'express';
import ValidationError from '../errors/ValidationError';
import CustomError from '../utils/CustomError';

const logError = (error: CustomError, request: Request): void => {
  const { getStatus, message, description } = error;
  console.error(`${request.method} ${request.url} => ${getStatus}: ${message} - ${description}`);
};

const handleValidationError = (
  error: ValidationError,
  request: Request,
  response: Response,
): void => {
  const { message, messages } = error;
  const err = new CustomError('Unprocessable entity', 422, message);

  messages.forEach((msg) => { err.addData(msg); });

  logError(err, request);
  response.status(err.getStatus).json(err.toJSON());
};

export const handleNotFound = (request: Request, response: Response, next: NextFunction): void => {
  next(new CustomError('Not found', 404, 'The requested route was not found'));
};

const handleCustomError = (
  error: CustomError,
  request: Request,
  response: Response,
): void => {
  logError(error, request);
  response.status(error.getStatus).json(error.toJSON());
};

export const handleError = (
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ValidationError) {
    return handleValidationError(error, request, response);
  }

  if (error instanceof CustomError) {
    return handleCustomError(error, request, response);
  }

  const err = new CustomError('Internal server error', 500);
  return handleCustomError(err, request, response);
};
