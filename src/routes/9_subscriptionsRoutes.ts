import express from 'express';
import * as subscriptionController from '@src/controllers/9_subscriptionController';

const router = express.Router();

// Rutas para Suscripciones

// Crear una nueva suscripción
router.post('/subscriptions', subscriptionController.createSubscription);

// Obtener una suscripción por su ID
router.get('/subscriptions/:subscriptionId', subscriptionController.getSubscriptionById);

// Actualizar el plan de una suscripción
router.patch('/subscriptions/:subscriptionId', subscriptionController.updateSubscriptionPlan);

// Eliminar una suscripción (soft delete)
router.delete('/subscriptions/:subscriptionId', subscriptionController.deleteSubscription);

// Restaurar una suscripción eliminada
router.post('/subscriptions/:subscriptionId/restore', subscriptionController.restoreSubscription);

// Listar todas las suscripciones de un usuario
router.get('/subscriptions/user/:userId', subscriptionController.listUserSubscriptions);

export default router;
