import { NextFunction, Request, Response } from 'express';
import ValidationError from '../errors/ValidationError';
import HttpError from '../errors/HttpError';

const logError = (error: HttpError, request: Request): void => {
  const { getStatus, message } = error;
  console.error(`${request.method} ${request.url} => ${getStatus}: ${message}`);
};

const handleValidationError = (
  error: ValidationError,
  request: Request,
  response: Response,
): void => {
  const { message, messages } = error;
  const err = new HttpError(422, message);

  messages.forEach((msg) => { err.addData(msg); });

  logError(err, request);
  response.status(err.getStatus).json(err.toJSON());
};

export const handleNotFound = (request: Request, response: Response, next: NextFunction): void => {
  next(new HttpError(404, 'The requested route was not found'));
};

const handleCustomError = (
  error: HttpError,
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

  if (error instanceof HttpError) {
    return handleCustomError(error, request, response);
  }

  const err = new HttpError();
  return handleCustomError(err, request, response);
};
