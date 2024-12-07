import { Router } from 'express';
import { getAllCatalogs, getCatalogByName } from '@src/controllers/13_catalogController';
import { ROUTES } from '@src/constants';

const router = Router();

// Ruta para obtener todos los catálogos
router.get(ROUTES.CATALOGS.BASE, getAllCatalogs);

// Ruta para obtener un catálogo específico por nombre
router.get(ROUTES.CATALOGS.BY_ID, getCatalogByName);

export default router;
