import { NextFunction, Request, Response } from 'express';
import { checkToken } from '../services/auth';
import CustomError from '../utils/CustomError';

const authorization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const token = request.headers.authorization as string;

  if (token == null) {
    return next(new CustomError('Bad request', 400, 'No token provided'));
  }

  if (!token.startsWith('Bearer ')) {
    return next(new CustomError('Unauthorized', 401, 'Invalid token'));
  }

  const sliced = token.slice(7);
  if (!await checkToken(sliced)) {
    return next(new CustomError('Unauthorized', 401, 'Invalid token'));
  }

  return next();
};

export default authorization;
