import { NextFunction, Request, Response } from 'express';
import IdDto from '../dtos/IdDto';
import PlayerDto from '../dtos/PlayerDto';
import DisplayNameAlreadyTakenError from '../errors/DisplayNameAlreadyTakenError';
import EntityNotFoundError from '../errors/EntityNotFoundError';
import HttpError from '../errors/HttpError';
import UniqueDisplayNameUserError from '../errors/UniqueDisplayNameUserError';
import * as playerService from '../services/player';
import * as userService from '../services/user';

export const get = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { id } = request.params;

  let player: PlayerDto;

  try {
    player = await playerService.get(id);
  } catch (error: unknown) {
    if (error instanceof EntityNotFoundError) {
      return next(new HttpError(404, error.message));
    }

    return next(new HttpError());
  }

  return response.json(player);
};

export const create = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = response.locals;
  const { displayName } = request.body;

  try {
    await userService.get(userId);
  } catch (error: unknown) {
    if (error instanceof EntityNotFoundError) {
      return next(new HttpError(404, error.message));
    }

    return next(new HttpError());
  }

  let result: IdDto;
  try {
    result = await playerService.create({ displayName, userId });
  } catch (error: unknown) {
    if (error instanceof DisplayNameAlreadyTakenError) {
      return next(new HttpError(409, error.message));
    }

    if (error instanceof UniqueDisplayNameUserError) {
      return next(new HttpError(409, error.message));
    }

    return next(new HttpError());
  }

  return response.json(result);
};

export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = response.locals;
  const { displayName } = request.body;

  try {
    await playerService.update({ userId, displayName });
  } catch (error: unknown) {
    if (error instanceof EntityNotFoundError) {
      return next(new HttpError(404, error.message));
    }

    return next(new HttpError());
  }

  return response.status(204).end();
};

export const me = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = response.locals;

  let player: PlayerDto;

  try {
    player = await playerService.me(userId);
  } catch (error: unknown) {
    if (error instanceof EntityNotFoundError) {
      return next(new HttpError(404, error.message));
    }

    return next(new HttpError());
  }

  return response.json(player);
};
