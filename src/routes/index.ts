import { Router } from 'express';
import { ROUTES } from '@src/constants';
import usersRouter from './userRoutes';
import groupRouter from './groupRoutes';
import matchesRouter from './matchesRoutes';
import miscRouter from './misc';

const router = Router();

router.use(ROUTES.USERS.BASE, usersRouter);
router.use(ROUTES.GROUPS.BASE, groupRouter);
router.use(ROUTES.MATCHES.BASE, matchesRouter);
router.use(miscRouter);

export default router;
