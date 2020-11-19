import { get } from 'env-var';

export const port = get('PORT')
  .required()
  .asPortNumber();

export const dbHost = get('DB_HOST')
  .required()
  .asString();

export const dbPort = get('DB_PORT')
  .required()
  .asPortNumber();

export const dbUser = get('DB_USER')
  .required()
  .asString();

export const dbPass = get('DB_PASS')
  .required()
  .asString();

export const salt = get('SALT')
  .required()
  .asString();

export const jwtSecret = get('JWT_SECRET')
  .required()
  .asString();

export const nodeEnv = get('NODE_ENV')
  .default('PRODUCTION')
  .asEnum(['DEVELOPMENT', 'PRODUCTION']);
