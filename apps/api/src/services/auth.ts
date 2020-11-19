import { pbkdf2Sync } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { EntityNotFoundError as TypeormEntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { jwtSecret, salt } from '../config';
import JwtDto from '../dtos/JwtDto';
import TokenDto from '../dtos/TokenDto';
import User from '../entities/User';
import BadCredentialsError from '../errors/BadCredentialsError';
import EntityNotFoundError from '../errors/EntityNotFoundError';
import UsernameAlreadyTakenError from '../errors/UsernameAlreadyTakenError';

export const login = async (username: string, password: string): Promise<TokenDto> => {
  let user: User;

  try {
    user = await getRepository(User).findOneOrFail({ where: { username } });
  } catch (error: unknown) {
    if (error instanceof TypeormEntityNotFoundError) {
      throw new EntityNotFoundError();
    }

    throw error;
  }

  const hashedPassword = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');
  if (user.password !== hashedPassword) {
    throw new BadCredentialsError();
  }

  const { password: pass, ...passwordlessUser } = user;
  const token = sign(passwordlessUser, jwtSecret);

  return { token };
};

export const register = async (username: string, password: string): Promise<void> => {
  const repository = getRepository(User);

  const user = await repository.findOne({ where: { username } });
  if (user !== undefined) {
    throw new UsernameAlreadyTakenError();
  }

  const hashedPassword = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');
  await repository.insert({ username, password: hashedPassword });
};

export const extractId = (token: string): JwtDto => {
  const verified = verify(token, jwtSecret);

  return verified as unknown as JwtDto;
};

export const checkToken = (token: string): boolean => {
  try {
    extractId(token);
    return true;
  } catch {
    return false;
  }
};
