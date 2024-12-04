import { Router } from 'express';
import { ROUTES } from '@src/constants';
import usersRouter from './userRoutes';
import groupRoutes from './groupRoutes';
import matchesRoutes from './matchesRoutes';
import miscRouter from './misc';

const router = Router();

router.use(ROUTES.USERS.BASE, usersRouter);
router.use(ROUTES.GROUPS.BASE, groupRoutes);
router.use(ROUTES.MATCHES.BASE, matchesRoutes);
router.use(miscRouter);

export default router;
