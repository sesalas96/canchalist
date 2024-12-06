/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Payment from '@src/models/5_Payment';
import { Request, Response } from 'express';

// Crear un nuevo pago
export const createPayment = async (req: Request, res: Response) => {
    try {
        const { userId, matchId, amount, paymentMethod } = req.body;

        if (!userId || !matchId || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const payment = await Payment.create({
            userId,
            matchId,
            amount,
            paymentMethod,
        });

        res.status(201).json(payment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un pago por su ID
export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);

        if (!payment || payment.isDeleted) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        res.status(200).json(payment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar el estado de un pago
export const updatePaymentStatus = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        if (!['pending', 'completed', 'failed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const payment = await Payment.findById(paymentId);

        if (!payment || payment.isDeleted) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        payment.status = status;
        payment.updatedAt = new Date();
        await payment.save();

        res.status(200).json(payment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un pago (soft delete)
export const deletePayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;

        const payment: any = await Payment.findById(paymentId);

        if (!payment || payment.isDeleted) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        await payment.softDelete();

        res.status(200).json({ message: 'Payment deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar un pago eliminado
export const restorePayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;

        const payment: any = await Payment.findById(paymentId);

        if (!payment || !payment.isDeleted) {
            return res.status(404).json({ message: 'Payment not found or not deleted.' });
        }

        await payment.restore();

        res.status(200).json(payment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar pagos con filtros opcionales
export const listPayments = async (req: Request, res: Response) => {
    try {
        const filters: any = {
            ...req.query,
            isDeleted: false,
        };

        const payments = await Payment.find(filters);

        res.status(200).json(payments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
