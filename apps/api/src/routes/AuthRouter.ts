import { Router } from 'express';
import { body } from 'express-validator';

import { login, register } from '../controllers/auth';
import createRoute from '../utils/createRoute';

const AuthRouter = Router();

createRoute(
  AuthRouter,
  'post',
  '/login',
  login,
  [
    body('username').isString(),
    body('password').isString(),
  ],
);

createRoute(
  AuthRouter,
  'post',
  '/register',
  register,
  [
    body('username').isString(),
    body('password').isString(),
  ],
);

export default AuthRouter;
