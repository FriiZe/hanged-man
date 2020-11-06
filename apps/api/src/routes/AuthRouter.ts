import {
  NextFunction, Request, Response, Router,
} from 'express';
import { body } from 'express-validator';

import { login, register } from '../controllers/auth';

const AuthRouter = Router();

AuthRouter.post(
  '/login', [
    body('username').isString(),
    body('password').isString(),
  ],
  (req: Request, res: Response, next: NextFunction) => login(req, res, next),
);

AuthRouter.post(
  '/register', [
    body('username').isString(),
    body('password').isString(),
  ],
  (req: Request, res: Response, next: NextFunction) => register(req, res, next),
);

export default AuthRouter;
