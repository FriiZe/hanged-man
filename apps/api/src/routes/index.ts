import { Router } from 'express';
import AuthRouter from './AuthRouter';
import PlayerRouter from './PlayerRouter';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/players', PlayerRouter);

export default router;
