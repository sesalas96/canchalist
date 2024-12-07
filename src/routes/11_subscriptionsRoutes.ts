import { Router } from 'express';
import {
    createSubscription,
    getSubscriptionById,
    updateSubscriptionPlan,
    deleteSubscription,
    restoreSubscription,
    listUserSubscriptions,
} from '@src/controllers/11_subscriptionController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear una nueva suscripción
router.post(ROUTES.SUBSCRIPTIONS.BASE, auth, createSubscription);

// Obtener una suscripción por ID
router.get(ROUTES.SUBSCRIPTIONS.BY_ID, auth, getSubscriptionById);

// Actualizar un plan de suscripción
router.put(ROUTES.SUBSCRIPTIONS.BY_ID, auth, updateSubscriptionPlan);

// Eliminar una suscripción
router.delete(ROUTES.SUBSCRIPTIONS.BY_ID, auth, deleteSubscription);

// Restaurar una suscripción eliminada
router.post(ROUTES.SUBSCRIPTIONS.RESTORE, auth, restoreSubscription);

// Listar todas las suscripciones de un usuario
router.get(ROUTES.SUBSCRIPTIONS.USER, auth, listUserSubscriptions);

export default router;
