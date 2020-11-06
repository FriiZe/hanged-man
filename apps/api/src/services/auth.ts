import { pbkdf2Sync } from 'crypto';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { jwtSecret, salt } from '../config';
import User from '../entities/User';
import BadCredentialsError from '../errors/BadCredentialsError';
import UsernameAlreadyTakenError from '../errors/UsernameAlreadyTakenError';

export const login = async (username: string, password: string): Promise<string> => {
  const user = await getRepository(User).findOneOrFail({ where: { username } });

  const hashedPassword = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');
  if (user.password !== hashedPassword) {
    throw new BadCredentialsError();
  }

  const { password: pass, ...passwordlessUser } = user;
  return sign(passwordlessUser, jwtSecret);
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
