import { Router } from 'express';
import * as paymentController from '../controllers/5_paymentController';

const router = Router();

// Rutas para Payments

// Crear un nuevo pago
router.post('/payments', paymentController.createPayment);

// Obtener un pago por su ID
router.get('/payments/:paymentId', paymentController.getPaymentById);

// Actualizar el estado de un pago
router.patch('/payments/:paymentId', paymentController.updatePaymentStatus);

// Eliminar un pago (soft delete)
router.delete('/payments/:paymentId', paymentController.deletePayment);

// Restaurar un pago eliminado
router.post('/payments/:paymentId/restore', paymentController.restorePayment);

// Listar pagos con filtros opcionales
router.get('/payments', paymentController.listPayments);

export default router;
