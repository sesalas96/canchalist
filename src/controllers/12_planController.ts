/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Plan from '@src/models/12_Plan';

// Crear un nuevo plan
export const createPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, description, durationInDays, isActive } = req.body;

        if (!name || !price || !durationInDays) {
            res.status(400).json({
                message: 'name, price, and durationInDays are required.',
            });
            return;
        }

        const newPlan = await Plan.create({
            name,
            price,
            description: description || '',
            durationInDays,
            isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
        });

        res.status(201).json({
            message: 'Plan created successfully.',
            plan: newPlan,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un plan por su ID
export const getPlanById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { planId } = req.params;

        const plan = await Plan.findById(planId);

        if (!plan || plan.isDeleted) {
            res.status(404).json({ message: 'Plan not found.' });
            return;
        }

        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un plan
export const updatePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { planId } = req.params;
        const { name, price, description, durationInDays, isActive } = req.body;

        const plan = await Plan.findById(planId);

        if (!plan || plan.isDeleted) {
            res.status(404).json({ message: 'Plan not found.' });
            return;
        }

        if (name) plan.name = name;
        if (price !== undefined) plan.price = price;
        if (description) plan.description = description;
        if (durationInDays !== undefined) plan.durationInDays = durationInDays;
        if (isActive !== undefined) plan.isActive = isActive;

        plan.updatedAt = new Date();
        await plan.save();

        res.status(200).json({
            message: 'Plan updated successfully.',
            plan,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un plan (soft delete)
export const deletePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { planId } = req.params;

        const plan = await Plan.findById(planId);

        if (!plan || plan.isDeleted) {
            res.status(404).json({ message: 'Plan not found.' });
            return;
        }

        plan.isDeleted = true;
        plan.deletedAt = new Date();
        await plan.save();

        res.status(200).json({ message: 'Plan deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar un plan eliminado
export const restorePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { planId } = req.params;

        const plan = await Plan.findById(planId);

        if (!plan || !plan.isDeleted) {
            res.status(404).json({ message: 'Plan not found or not deleted.' });
            return;
        }

        plan.isDeleted = false;
        plan.deletedAt = null;
        await plan.save();

        res.status(200).json({
            message: 'Plan restored successfully.',
            plan,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar todos los planes
export const listPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, isActive } = req.query;

        const filters: any = { isDeleted: false };
        if (isActive !== undefined) {
            filters.isActive = isActive === 'true';
        }

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const plans = await Plan.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalPlans = await Plan.countDocuments(filters);
        const totalPages = Math.ceil(totalPlans / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalPlans,
            data: plans,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
