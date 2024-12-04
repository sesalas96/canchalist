import { Router } from 'express';
import UserControllers from '@src/controllers/user';

const router = Router();

router.get('/', UserControllers.getAllUsers);
router.post('/', UserControllers.createUser);

export default router;
