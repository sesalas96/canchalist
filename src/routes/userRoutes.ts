import { Router } from 'express';
import {
    deleteUser,
    getUserById,
    loginUser,
    registerUser,
    restoreUser,
    updateUser,
} from '@src/controllers/userController';
import { authenticateToken } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post(ROUTES.USERS.REGISTER, registerUser);

// Ruta para iniciar sesión
router.post(ROUTES.USERS.LOGIN, loginUser);

// Ruta para obtener usuario por ID
router.get(ROUTES.USERS.BY_ID, authenticateToken, getUserById);

// Ruta para eliminar usuario por ID
router.delete(ROUTES.USERS.BY_ID, authenticateToken, deleteUser);

// Ruta para recuperar usuario por ID
router.post(ROUTES.USERS.RESTORE, authenticateToken, restoreUser);

// Ruta para actualizar un usuario
router.put(ROUTES.USERS.BY_ID, authenticateToken, updateUser);

export default router;
