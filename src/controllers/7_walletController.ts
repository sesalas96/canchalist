/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Wallet from '@src/models/7_Wallet';

// Obtener detalles de la billetera de un usuario
export const getWalletByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const wallet = await Wallet.findOne({ userId }).populate('transactions');
        if (!wallet) {
            res.status(404).json({ message: 'Billetera no encontrada' });
            return;
        }

        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar fondos a la billetera de un usuario
export const addFundsToWallet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            res.status(400).json({ message: 'El monto debe ser mayor a 0' });
            return;
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            res.status(404).json({ message: 'Billetera no encontrada' });
            return;
        }

        await wallet.addFunds(amount);

        res.status(200).json({ message: 'Fondos añadidos correctamente', wallet });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Deducir fondos de la billetera de un usuario
export const deductFundsFromWallet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            res.status(400).json({ message: 'El monto debe ser mayor a 0' });
            return;
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            res.status(404).json({ message: 'Billetera no encontrada' });
            return;
        }

        await wallet.deductFunds(amount);

        res.status(200).json({ message: 'Fondos deducidos correctamente', wallet });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Listar transacciones de la billetera de un usuario
export const listWalletTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const wallet = await Wallet.findOne({ userId }).populate('transactions');
        if (!wallet) {
            res.status(404).json({ message: 'Billetera no encontrada' });
            return;
        }

        res.status(200).json({ transactions: wallet.transactions });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todas las billeteras
export const listWallets = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const wallets = await Wallet.find()
            .populate('userId', 'name email') // Opcional: incluir información del usuario
            .skip(skip)
            .limit(limitNumber);

        const totalWallets = await Wallet.countDocuments();
        const totalPages = Math.ceil(totalWallets / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalWallets,
            data: wallets,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una billetera para un usuario
export const createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, currency } = req.body;

        if (!userId || !currency) {
            res.status(400).json({ message: 'Campos obligatorios: userId, currency' });
            return;
        }

        const existingWallet = await Wallet.findOne({ userId });
        if (existingWallet) {
            res.status(400).json({ message: 'El usuario ya tiene una billetera' });
            return;
        }

        const newWallet = new Wallet({ userId, currency });
        await newWallet.save();

        res.status(201).json({ message: 'Billetera creada con éxito', wallet: newWallet });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
