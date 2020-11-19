import {
  NextFunction, Request, RequestHandler, Response, Router,
} from 'express';
import { ValidationChain, validationResult, ValidationError as ExpressValidationError } from 'express-validator';
import ValidationError from '../errors/ValidationError';

type Method =
  'all' |
  'get' |
  'post' |
  'put' |
  'delete' |
  'patch' |
  'options' |
  'head';

type Handler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void | Response>;

const createMesage = (error: ExpressValidationError): string => {
  const { msg, param, location } = error;
  const errorMessage = `${msg} for ${param}`;

  return (location !== undefined)
    ? `${errorMessage} in ${location}`
    : errorMessage;
};

const validateRequest = (request: Request): void => {
  const validation = validationResult(request);
  if (!validation.isEmpty()) {
    const messages = validation.array().map((el) => createMesage(el));
    throw new ValidationError(messages);
  }
};

const validatedHandler = (handler: Handler) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    validateRequest(request);
    handler(request, response, next);
  } catch (error: unknown) {
    next(error);
  }
};

const createRoute = (
  router: Router,
  method: Method,
  path: string,
  handler: Handler,
  validators?: ValidationChain[],
  ...middlewares: RequestHandler[]
): void => {
  if (validators !== undefined) {
    router[method](path, validators, middlewares, validatedHandler(handler));
  } else {
    router[method](path, handler, middlewares);
  }
};

export default createRoute;
