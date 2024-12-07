import { Router } from 'express';
import {
    createCenter,
    listCenters,
    getCenterById,
    updateCenter,
    deleteCenter,
    restoreCenter,
    addMatchToCenter,
    listMatchesByCenter,
} from '@src/controllers/5_centerController';
import { ROUTES } from '@src/constants';
import { auth } from '@src/middlewares/authenticate';

const router = Router();

// Ruta para listar todos los centros deportivos
router.get(ROUTES.CENTERS.BASE, auth, listCenters);

// Ruta para obtener un centro deportivo por su ID
router.get(ROUTES.CENTERS.BY_ID, auth, getCenterById);

// Ruta para crear un nuevo centro deportivo
router.post(ROUTES.CENTERS.BASE, auth, createCenter);

// Ruta para actualizar un centro deportivo
router.put(ROUTES.CENTERS.BY_ID, auth, updateCenter);

// Ruta para eliminar un centro deportivo (soft delete)
router.delete(ROUTES.CENTERS.BY_ID, auth, deleteCenter);

// Ruta para restaurar un centro deportivo eliminado
router.post(ROUTES.CENTERS.RESTORE, auth, restoreCenter);

// Ruta para asociar un partido a un centro deportivo
router.post(ROUTES.CENTERS.ADD_MATCH, auth, addMatchToCenter);

// Ruta para listar los partidos asociados a un centro deportivo
router.get(ROUTES.CENTERS.MATCHES, auth, listMatchesByCenter);

export default router;
