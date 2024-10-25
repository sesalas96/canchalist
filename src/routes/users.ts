import { Router } from 'express';
import { ROUTES } from '@src/constants';
import UserControllers from '@src/controllers/user';
import { body } from 'express-validator';

const router = Router();

router.get("/", UserControllers.getAllUsers);
router.post("/", UserControllers.createUser);

export default router;
