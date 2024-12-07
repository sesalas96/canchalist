/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Payment from '@src/models/6_Payment';
import Wallet from '@src/models/7_Wallet';
import { PaymentStatus } from '@src/constants';

// Crear un nuevo pago
export const createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, matchId, amount, currency, method } = req.body;

        if (!userId || !amount || !currency || !method) {
            res.status(400).json({
                message: 'Campos obligatorios: userId, amount, currency, method',
            });
            return;
        }

        // Generar un transactionId único
        const transactionId = uuidv4();

        // Crear el pago
        const newPayment = new Payment({
            userId,
            matchId,
            amount,
            currency,
            method,
            transactionId,
            status: PaymentStatus.Pending,
        });

        await newPayment.save();

        res.status(201).json({ message: 'Pago creado con éxito', payment: newPayment });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Listar pagos con filtros opcionales
export const listPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, matchId, status, page = 1, limit = 10 } = req.query;

        const filters: any = {};
        if (userId) filters.userId = userId;
        if (matchId) filters.matchId = matchId;
        if (status) filters.status = status;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const payments = await Payment.find(filters).skip(skip).limit(limitNumber);
        const totalPayments = await Payment.countDocuments(filters);
        const totalPages = Math.ceil(totalPayments / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalPayments,
            data: payments,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un pago por ID
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const payment = await Payment.findById(id);
        if (!payment) {
            res.status(404).json({ message: 'Pago no encontrado' });
            return;
        }

        res.status(200).json(payment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un pago
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const payment = await Payment.findByIdAndUpdate(id, updates, { new: true });
        if (!payment) {
            res.status(404).json({ message: 'Pago no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Pago actualizado correctamente', payment });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Cambiar el estado de un pago
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Object.values(PaymentStatus).includes(status)) {
            res.status(400).json({
                message: `El estado debe ser uno de: ${Object.values(PaymentStatus).join(', ')}`,
            });
            return;
        }

        const payment = await Payment.findById(id);
        if (!payment) {
            res.status(404).json({ message: 'Pago no encontrado' });
            return;
        }

        payment.status = status;
        await payment.save();

        res.status(200).json({ message: 'Estado del pago actualizado correctamente', payment });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Registrar un pago completado en la billetera del usuario
export const completePayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const payment: any = await Payment.findById(id);
        if (!payment) {
            res.status(404).json({ message: 'Pago no encontrado' });
            return;
        }

        if (payment.status !== PaymentStatus.Pending) {
            res.status(400).json({ message: 'El pago ya fue procesado' });
            return;
        }

        const wallet = await Wallet.findOne({ userId: payment.userId });
        if (!wallet) {
            res.status(404).json({ message: 'Billetera del usuario no encontrada' });
            return;
        }

        // Agregar fondos a la billetera
        await wallet.addFunds(payment.amount);

        // Cambiar el estado del pago
        payment.status = PaymentStatus.Completed;

        // Agregar el ID del pago a las transacciones de la billetera
        wallet.transactions.push(new mongoose.Types.ObjectId(payment._id));

        // Guardar cambios
        await payment.save();
        await wallet.save();

        res.status(200).json({ message: 'Pago completado y registrado en la billetera', payment });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
