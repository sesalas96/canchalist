/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Subscription from '@src/models/9_Subscription';
import Plan from '@src/models/10_Plan';
import { Request, Response } from 'express';

// Crear una nueva suscripción
export const createSubscription = async (req: Request, res: Response) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({ message: 'userId and planId are required.' });
        }

        // Validar si el plan existe
        const plan = await Plan.findById(planId);
        if (!plan || plan.isDeleted) {
            return res.status(404).json({ message: 'Plan not found or inactive.' });
        }

        // Calcular fechas de inicio y fin según la duración del plan
        const startDate = new Date();
        const endDate = new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000);

        // Crear la suscripción
        const subscription = await Subscription.create({
            userId,
            plan: plan.name, // Guardar el nombre del plan para facilitar la consulta
            startDate,
            endDate,
            isActive: true,
        });

        res.status(201).json(subscription);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una suscripción por su ID
export const getSubscriptionById = async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription || subscription.isDeleted) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        res.status(200).json(subscription);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un plan de suscripción
export const updateSubscriptionPlan = async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;
        const { plan, endDate } = req.body;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription || subscription.isDeleted) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        if (plan) subscription.plan = plan;
        if (endDate) subscription.endDate = new Date(endDate);
        subscription.updatedAt = new Date();

        await subscription.save();

        res.status(200).json(subscription);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una suscripción (soft delete)
export const deleteSubscription = async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;

        const subscription: any = await Subscription.findById(subscriptionId);

        if (!subscription || subscription.isDeleted) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        await subscription.softDelete();

        res.status(200).json({ message: 'Subscription deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar una suscripción eliminada
export const restoreSubscription = async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;

        const subscription: any = await Subscription.findById(subscriptionId);

        if (!subscription || !subscription.isDeleted) {
            return res.status(404).json({ message: 'Subscription not found or not deleted.' });
        }

        await subscription.restore();

        res.status(200).json(subscription);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar todas las suscripciones de un usuario
export const listUserSubscriptions = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const filters: any = {
            userId,
            isDeleted: false,
        };

        const subscriptions = await Subscription.find(filters).sort({ createdAt: -1 });

        res.status(200).json(subscriptions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
