import { NextFunction, Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import * as service from '../services/auth';
import CustomError from '../utils/CustomError';
import BadCredentialsError from '../errors/BadCredentialsError';
import UsernameAlreadyTakenError from '../errors/UsernameAlreadyTakenError';

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { username, password } = request.body;

  let token: string;

  try {
    token = await service.login(username, password);
  } catch (error: unknown) {
    if (error instanceof EntityNotFoundError) {
      return next(new CustomError('Not Found', 404, error.message));
    }

    if (error instanceof BadCredentialsError) {
      return next(new CustomError('Unauthorized', 401, error.message));
    }

    return next(new CustomError('Internal server error'));
  }

  return response.json({ token });
};

export const register = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const { username, password } = request.body;

  try {
    await service.register(username, password);
  } catch (error: unknown) {
    if (error instanceof UsernameAlreadyTakenError) {
      return next(new CustomError('Conflict', 409, error.message));
    }

    return next(new CustomError('Internal server error'));
  }

  return response.status(201).end();
};
