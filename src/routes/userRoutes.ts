import { Router } from 'express';
import { getUserById, loginUser, registerUser } from '@src/controllers/userController';
import { authenticateToken } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post(ROUTES.USERS.REGISTER, registerUser);

// Ruta para iniciar sesión
router.post(ROUTES.USERS.LOGIN, loginUser);

// Ruta para obtener usuario por ID
router.get(ROUTES.USERS.BY_ID, authenticateToken, getUserById);

export default router;
