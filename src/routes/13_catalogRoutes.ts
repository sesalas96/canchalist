import { Router } from 'express';
import { getAllCatalogs, getCatalogByName } from '@src/controllers/13_catalogController';
import { ROUTES } from '@src/constants';
import { auth } from '@src/middlewares/authenticate';

const router = Router();

// Ruta para obtener todos los catálogos
router.get(ROUTES.CATALOGS.BASE, auth, getAllCatalogs);

// Ruta para obtener un catálogo específico por nombre
router.get(ROUTES.CATALOGS.BY_ID, auth, getCatalogByName);

export default router;
