import { Router } from 'express';
import {
    createPayment,
    listPayments,
    getPaymentById,
    updatePayment,
    updatePaymentStatus,
    completePayment,
} from '@src/controllers/6_paymentController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear un nuevo pago
router.post(ROUTES.PAYMENTS.BASE, auth, createPayment);

// Listar pagos con filtros opcionales
router.get(ROUTES.PAYMENTS.BASE, auth, listPayments);

// Obtener un pago por ID
router.get(ROUTES.PAYMENTS.BY_ID, auth, getPaymentById);

// Actualizar un pago
router.put(ROUTES.PAYMENTS.BY_ID, auth, updatePayment);

// Cambiar el estado de un pago
router.patch(ROUTES.PAYMENTS.UPDATE_STATUS, auth, updatePaymentStatus);

// Completar un pago y registrar en la billetera del usuario
router.post(ROUTES.PAYMENTS.COMPLETE, auth, completePayment);

export default router;
