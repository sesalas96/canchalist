import { Router } from 'express';
import miscRouter from './0_misc';
import usersRouter from './1_userRoutes';
import groupRouter from './3_groupRoutes';
import matchesRouter from './4_matchesRoutes';

const router = Router();

router.use(usersRouter);
router.use(groupRouter);
router.use(matchesRouter);
router.use(miscRouter);

export default router;
