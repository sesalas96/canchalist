import { Router } from 'express';
import miscRouter from './misc';
import usersRouter from './users';
import examplesRouter from './examples';

const router = Router();

router.use(miscRouter);
router.use(usersRouter);
router.use(examplesRouter);

export default router;
