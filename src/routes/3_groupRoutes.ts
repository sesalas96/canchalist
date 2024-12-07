import { Router } from 'express';
import {
    createGroup,
    deleteGroup,
    getGroupById,
    getGroupMembers,
    joinGroup,
    restoreGroup,
    updateGroup,
    listGroups,
} from '@src/controllers/3_groupController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Ruta para crear un grupo
router.post(ROUTES.GROUPS.BASE, auth, createGroup);

// Ruta para obtener detalles de un grupo por ID
router.get(ROUTES.GROUPS.BY_ID, auth, getGroupById);

// Ruta para unirse a un grupo
router.post(ROUTES.GROUPS.JOIN, auth, joinGroup);

// Ruta para listar miembros de un grupo
router.get(ROUTES.GROUPS.MEMBERS, auth, getGroupMembers);

// Ruta para listar miembros de un grupo
router.get(ROUTES.GROUPS.MEMBERS, auth, getGroupMembers);

// Ruta para eliminar un grupo
router.delete(ROUTES.GROUPS.BY_ID, auth, deleteGroup);

// Ruta para recuperar un grupo
router.post(ROUTES.GROUPS.RESTORE, auth, restoreGroup);

// Ruta para actualizar un grupo
router.put(ROUTES.GROUPS.BY_ID, auth, updateGroup);

// Ruta para listar grupos
router.get(ROUTES.GROUPS.LIST, auth, listGroups);

export default router;
