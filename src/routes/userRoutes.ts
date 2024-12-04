import { Router } from 'express';
import { getUserById, loginUser, registerUser } from '@src/controllers/userController';

const router = Router();

// Ruta para obtener usuario por ID
router.get('/:id', getUserById);

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

export default router;
