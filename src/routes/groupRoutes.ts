import { Router } from 'express';
import {
    createGroup,
    deleteGroup,
    getGroupById,
    getGroupMembers,
    joinGroup,
    restoreGroup,
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

// Ruta para listar miembros de un grupo
router.get(ROUTES.GROUPS.MEMBERS, authenticateToken, getGroupMembers);

// Ruta para eliminar un grupo
router.delete(ROUTES.GROUPS.BY_ID, authenticateToken, deleteGroup);

// Ruta para eliminar un grupo
router.post(ROUTES.GROUPS.RESTORE, authenticateToken, restoreGroup);

export default router;
