/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Subscription from '@src/models/11_Subscription';
import Plan from '@src/models/12_Plan';
import { Request, Response } from 'express';

// Crear una nueva suscripción
export const createSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            res.status(400).json({ message: 'userId and planId are required.' });
            return;
        }

        // Validar si el plan existe
        const plan = await Plan.findById(planId);
        if (!plan || plan.isDeleted) {
            res.status(404).json({ message: 'Plan not found or inactive.' });
            return;
        }

        // Calcular fechas de inicio y fin según la duración del plan
        const startDate = new Date();
        const endDate = new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000);

        // Crear la suscripción
        const subscription = await Subscription.create({
            userId,
            plan: plan.name,
            planId: plan._id,
            startDate,
            endDate,
            isActive: true,
        });

        res.status(201).json({ message: 'Subscription created successfully.', subscription });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una suscripción por su ID
export const getSubscriptionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subscriptionId } = req.params;

        // Usar populate para incluir detalles del plan
        const subscription = await Subscription.findById(subscriptionId).populate('planId');

        if (!subscription || subscription.isDeleted) {
            res.status(404).json({ message: 'Subscription not found.' });
            return;
        }

        res.status(200).json(subscription);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un plan de suscripción
export const updateSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subscriptionId } = req.params;
        const { planId, endDate } = req.body;

        const subscription: any = await Subscription.findById(subscriptionId);

        if (!subscription || subscription.isDeleted) {
            res.status(404).json({ message: 'Subscription not found.' });
            return;
        }

        if (planId) {
            const plan = await Plan.findById(planId);
            if (!plan || plan.isDeleted) {
                res.status(404).json({ message: 'Plan not found or inactive.' });
                return;
            }
            subscription.plan = plan.name;
            subscription.planId = plan._id;
        }
        if (endDate) subscription.endDate = new Date(endDate);

        subscription.updatedAt = new Date();
        await subscription.save();

        res.status(200).json({
            message: 'Subscription updated successfully.',
            subscription,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una suscripción (soft delete)
export const deleteSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription || subscription.isDeleted) {
            res.status(404).json({ message: 'Subscription not found.' });
            return;
        }

        subscription.isDeleted = true;
        subscription.deletedAt = new Date();
        await subscription.save();

        res.status(200).json({ message: 'Subscription deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar una suscripción eliminada
export const restoreSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription || !subscription.isDeleted) {
            res.status(404).json({ message: 'Subscription not found or not deleted.' });
            return;
        }

        subscription.isDeleted = false;
        subscription.deletedAt = null;
        await subscription.save();

        res.status(200).json({ message: 'Subscription restored successfully.', subscription });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar todas las suscripciones de un usuario
export const listUserSubscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const filters: any = { userId, isDeleted: false };
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const subscriptions = await Subscription.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate('planId');

        const totalSubscriptions = await Subscription.countDocuments(filters);
        const totalPages = Math.ceil(totalSubscriptions / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalSubscriptions,
            data: subscriptions,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
