import { Router } from 'express';
import miscRouter from './misc';
import usersRouter from './users';
import examplesRouter from './examples';
import sectionRouter from './section';
import { ROUTES } from '@src/constants';

const router = Router();

router.use(ROUTES.SECTION.BASE, sectionRouter);
router.use(miscRouter);
router.use(usersRouter);
router.use(examplesRouter);

export default router;
