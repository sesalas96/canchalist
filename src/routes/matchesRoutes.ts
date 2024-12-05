import { Router } from 'express';
import {
    createMatch,
    getMatchById,
    joinMatch,
    deleteMatch,
    restoreMatch,
} from '../controllers/matchController';
import { ROUTES } from '@src/constants';
import { authenticateToken } from '@src/middlewares/authenticate';

const router = Router();

// Ruta para crear una nueva mejenga
router.post(ROUTES.MATCHES.BASE, authenticateToken, createMatch);

// Ruta para obtener detalles de una mejenga específica
router.get(ROUTES.MATCHES.BY_ID, authenticateToken, getMatchById);

// Ruta para unirse a una mejenga
router.post(ROUTES.MATCHES.JOIN, authenticateToken, joinMatch);

// Eliminar una mejenga
router.delete(ROUTES.MATCHES.BY_ID, authenticateToken, deleteMatch);

// Recuperar una mejenga
router.post(ROUTES.MATCHES.RESTORE, authenticateToken, restoreMatch);

export default router;
