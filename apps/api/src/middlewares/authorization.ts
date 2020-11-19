import { NextFunction, Request, Response } from 'express';
import { checkToken, extractId } from '../services/auth';
import HttpError from '../errors/HttpError';

const authorization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const token = request.headers.authorization as string;

  if (token == null) {
    return next(new HttpError(400, 'No token provided'));
  }

  if (!token.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Invalid token'));
  }

  const sliced = token.slice(7);
  if (!checkToken(sliced)) {
    return next(new HttpError(401, 'Invalid token'));
  }

  response.locals.userId = extractId(sliced).id;

  return next();
};

export default authorization;
