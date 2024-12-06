import express from 'express';
import * as planController from '@src/controllers/10_planController';

const router = express.Router();

// Rutas para Planes

// Crear un nuevo plan
router.post('/plans', planController.createPlan);

// Obtener un plan por su ID
router.get('/plans/:planId', planController.getPlanById);

// Actualizar un plan
router.patch('/plans/:planId', planController.updatePlan);

// Eliminar un plan (soft delete)
router.delete('/plans/:planId', planController.deletePlan);

// Restaurar un plan eliminado
router.post('/plans/:planId/restore', planController.restorePlan);

// Listar todos los planes
router.get('/plans', planController.listPlans);

export default router;
