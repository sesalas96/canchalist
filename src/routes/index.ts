import { Router } from 'express';
import miscRouter from './misc';
import usersRouter from './users';
import sectionRouter from './section';
import { ROUTES } from '@src/constants';

const router = Router();

router.use(ROUTES.SECTION.BASE, sectionRouter);
router.use(ROUTES.USERS.BASE, usersRouter);
router.use(miscRouter);

export default router;
