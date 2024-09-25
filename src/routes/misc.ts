import { Router } from 'express';
import { ROUTES } from '@src/constants';

const router = Router();

router.get(ROUTES.MISC.PING, (_, res) => {
  res.status(200).send('pong');
});

router.get(ROUTES.MISC.HEALTHCHECK, (_, res) => {
  // Check for external dependencies health here
  res.status(200).send({ status: 'up' });
});

export default router;
