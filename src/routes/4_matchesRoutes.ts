import { Router } from 'express';
import {
    createMatch,
    getMatchById,
    joinMatch,
    deleteMatch,
    restoreMatch,
    updateMatch,
    listMatches,
    leaveMatch,
} from '../controllers/4_matchController';
import { ROUTES } from '@src/constants';
import { auth } from '@src/middlewares/authenticate';

const router = Router();

// Ruta para listar todas las matchs de un grupo (con filtros y paginación)
router.get(ROUTES.MATCHES.BASE, auth, listMatches);

// Ruta para crear una nueva match en un grupo
router.post(ROUTES.MATCHES.BASE, auth, createMatch);

// Ruta para obtener detalles de un match específica
router.get(ROUTES.MATCHES.BY_ID, auth, getMatchById);

// Ruta para unirse a un match
router.post(ROUTES.MATCHES.JOIN, auth, joinMatch);

// Ruta para salir de un match
router.post(ROUTES.MATCHES.LEAVE, auth, leaveMatch);

// Eliminar un match (soft delete)
router.delete(ROUTES.MATCHES.DELETE, auth, deleteMatch);

// Recuperar un match eliminada
router.post(ROUTES.MATCHES.RESTORE, auth, restoreMatch);

// Ruta para actualizar un match
router.patch(ROUTES.MATCHES.UPDATE, auth, updateMatch);

export default router;
