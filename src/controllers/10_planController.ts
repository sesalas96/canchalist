/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Plan from '@src/models/10_Plan';

// Crear un nuevo plan
export const createPlan = async (req: Request, res: Response) => {
    try {
        const { name, price, description, durationInDays } = req.body;

        if (!name || !price || !durationInDays) {
            return res
                .status(400)
                .json({ message: 'name, price, and durationInDays are required.' });
        }

        const newPlan = await Plan.create({
            name,
            price,
            description,
            durationInDays,
        });

        res.status(201).json(newPlan);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un plan por su ID
export const getPlanById = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;

        const plan = await Plan.findById(planId);

        if (!plan || plan.isDeleted) {
            return res.status(404).json({ message: 'Plan not found.' });
        }

        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un plan
export const updatePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const { name, price, description, durationInDays, isActive } = req.body;

        const plan = await Plan.findById(planId);

        if (!plan || plan.isDeleted) {
            return res.status(404).json({ message: 'Plan not found.' });
        }

        if (name) plan.name = name;
        if (price !== undefined) plan.price = price;
        if (description) plan.description = description;
        if (durationInDays !== undefined) plan.durationInDays = durationInDays;
        if (isActive !== undefined) plan.isActive = isActive;

        plan.updatedAt = new Date();

        await plan.save();

        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un plan (soft delete)
export const deletePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;

        const plan: any = await Plan.findById(planId);

        if (!plan || plan.isDeleted) {
            return res.status(404).json({ message: 'Plan not found.' });
        }

        await plan.softDelete();

        res.status(200).json({ message: 'Plan deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar un plan eliminado
export const restorePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;

        const plan: any = await Plan.findById(planId);

        if (!plan || !plan.isDeleted) {
            return res.status(404).json({ message: 'Plan not found or not deleted.' });
        }

        await plan.restore();

        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar todos los planes
export const listPlans = async (req: Request, res: Response) => {
    try {
        const filters: any = { isDeleted: false };

        const plans = await Plan.find(filters).sort({ createdAt: -1 });

        res.status(200).json(plans);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
