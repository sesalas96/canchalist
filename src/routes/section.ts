import { Router } from 'express';
import { ROUTES } from '@src/constants';
import SectionControllers from '@src/controllers/section';

const router = Router();

router.get(ROUTES.SECTION.ENDPOINT_FUNCTION, SectionControllers.endpointFunction);

export default router;
