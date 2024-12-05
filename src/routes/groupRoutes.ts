import { Router } from 'express';
import {
    createGroup,
    getGroupById,
    getGroupMembers,
    joinGroup,
} from '@src/controllers/groupController';
import { authenticateToken } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Ruta para crear un grupo
router.post(ROUTES.GROUPS.BASE, authenticateToken, createGroup);

// Ruta para obtener detalles de un grupo por ID
router.get(ROUTES.GROUPS.BY_ID, authenticateToken, getGroupById);

// Ruta para unirse a un grupo
router.post(ROUTES.GROUPS.JOIN, authenticateToken, joinGroup);

// Ruta para listar miembros de un grupo
router.get(ROUTES.GROUPS.MEMBERS, authenticateToken, getGroupMembers);

export default router;
