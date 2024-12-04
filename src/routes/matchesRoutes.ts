import { Router } from 'express';
import { createMatch, getMatchById, joinMatch } from '../controllers/matchController';

const router = Router();

// Ruta para crear una nueva mejenga
router.post('/groups/:groupId/matches', createMatch);

// Ruta para obtener detalles de una mejenga específica
router.get('/groups/:groupId/matches/:matchId', getMatchById);

// Ruta para unirse a una mejenga
router.post('/groups/:groupId/matches/:matchId/join', joinMatch);

export default router;
