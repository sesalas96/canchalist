import { Router } from 'express';
import {
    createHistory,
    getHistoryById,
    updateHistory,
    deleteHistory,
    restoreHistory,
    listHistories,
} from '@src/controllers/8_historyController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear un nuevo registro de historial
router.post(ROUTES.HISTORIES.BASE, auth, createHistory);

// Obtener un registro de historial por su ID
router.get(ROUTES.HISTORIES.BY_ID, auth, getHistoryById);

// Actualizar un registro de historial por su ID
router.put(ROUTES.HISTORIES.BY_ID, auth, updateHistory);

// Eliminar un registro de historial (soft delete)
router.delete(ROUTES.HISTORIES.BY_ID, auth, deleteHistory);

// Restaurar un registro de historial eliminado
router.post(ROUTES.HISTORIES.RESTORE, auth, restoreHistory);

// Listar todos los registros de historial (opcionalmente con filtros)
router.get(ROUTES.HISTORIES.LIST, auth, listHistories);

export default router;
