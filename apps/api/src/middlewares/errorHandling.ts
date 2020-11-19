import { NextFunction, Request, Response } from 'express';
import { EOL } from 'os';
import ValidationError from '../errors/ValidationError';
import HttpError from '../errors/HttpError';
import { nodeEnv } from '../config';

const logError = (error: HttpError, request: Request): void => {
  const { getStatus, message, stack } = error;

  let msg = `${request.method} ${request.url} => ${getStatus}: ${message}`;
  if (nodeEnv === 'DEVELOPMENT') {
    msg += `${EOL}${stack}`;
  }

  console.error(msg);
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

const handleHttpError = (
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
    return handleHttpError(error, request, response);
  }

  const err = new HttpError();
  return handleHttpError(err, request, response);
};
