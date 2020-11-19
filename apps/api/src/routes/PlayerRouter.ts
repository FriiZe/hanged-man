import { Router } from 'express';
import { body, param } from 'express-validator';
import createRoute from '../utils/createRoute';
import {
  create, get, me, update,
} from '../controllers/player';
import authorization from '../middlewares/authorization';

const PlayerRouter = Router();

createRoute(
  PlayerRouter,
  'get',
  '/me',
  me,
  [],
  authorization,
);

createRoute(
  PlayerRouter,
  'get',
  '/:id',
  get,
  [
    param('id').isUUID(),
  ],
  authorization,
);

createRoute(
  PlayerRouter,
  'patch',
  '/',
  update,
  [
    body('displayName').isString(),
  ],
  authorization,
);

createRoute(
  PlayerRouter,
  'post',
  '/',
  create,
  [
    body('displayName').isString(),
  ],
  authorization,
);

export default PlayerRouter;
