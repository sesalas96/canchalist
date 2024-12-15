import { Router } from 'express';

import miscRouter from './0_misc';
import usersRouter from './1_userRoutes';
import rolesRouter from './2_roleRoutes';
import groupRouter from './3_groupRoutes';
import matchesRouter from './4_matchesRoutes';
import centersRouter from './5_centersRouters';
import paymentsRouter from './6_paymentsRoutes';
import walletsRouter from './7_walletRoutes';
import historiesRouter from './8_historiesRoutes';
import reviewiesRouter from './9_reviewiesRoutes';
import notificationsRouter from './10_notificationsRoutes';
import subscriptionsRouter from './11_subscriptionsRoutes';
import plansRouter from './12_planRoutes';
import catalogsRouter from './13_catalogRoutes';

const router = Router();

router.use(miscRouter);
router.use(usersRouter);
router.use(rolesRouter);
router.use(groupRouter);
router.use(matchesRouter);
router.use(centersRouter);
router.use(paymentsRouter);
router.use(walletsRouter);
router.use(historiesRouter);
router.use(reviewiesRouter);
router.use(notificationsRouter);
router.use(subscriptionsRouter);
router.use(plansRouter);
router.use(catalogsRouter);

export default router;
