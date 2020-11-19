import { getRepository } from 'typeorm';
import { EntityNotFoundError as TypeormEntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import User from '../entities/User';
import EntityNotFoundError from '../errors/EntityNotFoundError';

/* eslint-disable import/prefer-default-export */
export const get = async (id: string): Promise<User> => {
  let user: User;

  try {
    user = await getRepository(User).findOneOrFail(id);
  } catch (error: unknown) {
    if (error instanceof TypeormEntityNotFoundError) {
      throw new EntityNotFoundError();
    }

    throw error;
  }

  return user;
};
