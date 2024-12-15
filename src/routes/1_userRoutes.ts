import { Router } from 'express';
import {
    deleteUser,
    getUserById,
    loginUser,
    registerUser,
    restoreUser,
    updateUser,
    listUsers,
    validateToken,
    logoutUser,
} from '@src/controllers/1_userController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post(ROUTES.USERS.REGISTER, registerUser);

router.post(ROUTES.USERS.VALIDATE, validateToken);

// Ruta para obtener usuario por ID
router.get(ROUTES.USERS.BY_ID, auth, getUserById);

// Ruta para listar todos los usuarios
router.get(ROUTES.USERS.LIST, auth, listUsers);

// Ruta para eliminar usuario por ID (soft delete)
router.delete(ROUTES.USERS.DELETE, auth, deleteUser);

// Ruta para recuperar usuario por ID
router.post(ROUTES.USERS.RESTORE, auth, restoreUser);

// Ruta para actualizar un usuario
router.put(ROUTES.USERS.UPDATE, auth, updateUser);

// Ruta para iniciar sesión
router.post(ROUTES.USERS.LOGIN, loginUser);

// Ruta para salir de la sesión
router.post(ROUTES.USERS.LOGOUT, auth, logoutUser);

export default router;
