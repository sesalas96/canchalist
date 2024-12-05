import { Router } from 'express';
import usersRouter from './userRoutes';
import groupRouter from './groupRoutes';
import matchesRouter from './matchesRoutes';
import miscRouter from './misc';

const router = Router();

router.use(usersRouter);
router.use(groupRouter);
router.use(matchesRouter);
router.use(miscRouter);

export default router;
