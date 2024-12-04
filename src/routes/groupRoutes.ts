import { Router } from 'express';
import {
    createGroup,
    getGroupById,
    getGroupMembers,
    joinGroup,
} from '@src/controllers/groupController';

const router = Router();

// Ruta para crear un grupo
router.post('/', createGroup);

// Ruta para obtener detalles de un grupo por ID
router.get('/:id', getGroupById);

// Ruta para unirse a un grupo
router.post('/:id/join', joinGroup);

// Ruta para listar miembros de un grupo
router.get('/:id/members', getGroupMembers);

export default router;
