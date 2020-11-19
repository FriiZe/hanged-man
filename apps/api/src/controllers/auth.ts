import { NextFunction, Request, Response } from 'express';
import * as service from '../services/auth';
import HttpError from '../errors/HttpError';
import BadCredentialsError from '../errors/BadCredentialsError';
import UsernameAlreadyTakenError from '../errors/UsernameAlreadyTakenError';
import EntityNotFoundError from '../errors/EntityNotFoundError';
import TokenDto from '../dtos/TokenDto';

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { username, password } = request.body;

  let tokenResult: TokenDto;

  try {
    tokenResult = await service.login(username, password);
  } catch (error: unknown) {
    if (error instanceof EntityNotFoundError) {
      return next(new HttpError(404, error.message));
    }

    if (error instanceof BadCredentialsError) {
      return next(new HttpError(401, error.message));
    }

    return next(new HttpError());
  }

  return response.json(tokenResult);
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
      return next(new HttpError(409, error.message));
    }

    return next(new HttpError());
  }

  return response.status(201).end();
};
