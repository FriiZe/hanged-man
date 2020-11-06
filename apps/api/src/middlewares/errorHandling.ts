import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validator';
import CustomError from '../utils/CustomError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidationError = (error: any): error is ValidationError => {
  const keys = ['param', 'msg', 'nestedErrors', 'location', 'value'];
  return keys.every((k) => k in error);
};

const logError = (error: CustomError, request: Request): void => {
  const { getStatus, message, description } = error;
  console.error(`${request.method} ${request.url} => ${getStatus}: ${message} - ${description}`);
};

const handleValidationError = (
  error: ValidationError,
  request: Request,
  response: Response,
): void => {
  const { msg, nestedErrors } = error;
  const err = new CustomError('Unprocessable entity', 422, msg);

  if (nestedErrors !== undefined) {
    nestedErrors.forEach((e) => { err.addData(e); });
  }

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
  if (isValidationError(error)) {
    return handleValidationError(error, request, response);
  }

  if (error instanceof CustomError) {
    return handleCustomError(error, request, response);
  }

  const err = new CustomError('Internal server error', 500);
  return handleCustomError(err, request, response);
};
