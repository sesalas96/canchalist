import { Router } from 'express';
import {
    createPlan,
    getPlanById,
    updatePlan,
    deletePlan,
    restorePlan,
    listPlans,
} from '@src/controllers/12_planController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear un nuevo plan
router.post(ROUTES.PLANS.BASE, auth, createPlan);

// Obtener un plan por ID
router.get(ROUTES.PLANS.BY_ID, auth, getPlanById);

// Actualizar un plan
router.put(ROUTES.PLANS.BY_ID, auth, updatePlan);

// Eliminar un plan
router.delete(ROUTES.PLANS.BY_ID, auth, deletePlan);

// Restaurar un plan eliminado
router.post(ROUTES.PLANS.RESTORE, auth, restorePlan);

// Listar todos los planes
router.get(ROUTES.PLANS.BASE, auth, listPlans);

export default router;
