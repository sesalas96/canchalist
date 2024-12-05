import { Router } from 'express';
import { createMatch, getMatchById, joinMatch, deleteMatch } from '../controllers/matchController';
import { ROUTES } from '@src/constants';
import { authenticateToken } from '@src/middlewares/authenticate';

const router = Router();

// Ruta para crear una nueva mejenga
router.post(ROUTES.MATCHES.BASE, authenticateToken, createMatch);

// Ruta para obtener detalles de una mejenga específica
router.get(ROUTES.MATCHES.BY_ID, authenticateToken, getMatchById);

// Ruta para unirse a una mejenga
router.post(ROUTES.MATCHES.JOIN, authenticateToken, joinMatch);

// Ruta para unirse a una mejenga
router.delete(ROUTES.MATCHES.BY_ID, authenticateToken, deleteMatch);

export default router;
