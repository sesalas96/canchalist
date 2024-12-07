/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Center from '@src/models/5_Center';
import Match from '../models/4_Match';

// Listar todos los centros deportivos
export const listCenters = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        const skip = (pageNumber - 1) * limitNumber;

        const centers = await Center.find({ isDeleted: false }).skip(skip).limit(limitNumber);

        const totalCenters = await Center.countDocuments({ isDeleted: false });
        const totalPages = Math.ceil(totalCenters / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalCenters,
            data: centers,
        });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener detalles de un centro por ID
export const getCenterById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { centerId } = req.params;

        const center = await Center.findById(centerId).populate('matches', 'name date');
        if (!center) {
            res.status(404).send({ message: 'Centro no encontrado' });
            return;
        }

        res.status(200).json(center);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Crear un nuevo centro deportivo
export const createCenter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, location, facilities, capacity } = req.body;

        if (!name || !location || !capacity) {
            res.status(400).send({ message: 'El nombre, ubicación y capacidad son obligatorios' });
            return;
        }

        const newCenter = new Center({ name, location, facilities, capacity, matches: [] });
        await newCenter.save();

        res.status(201).json({ message: 'Centro creado con éxito', center: newCenter });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Actualizar un centro deportivo
export const updateCenter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { centerId } = req.params;
        const updates = req.body;

        const center = await Center.findByIdAndUpdate(centerId, updates, { new: true });
        if (!center) {
            res.status(404).send({ message: 'Centro no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Centro actualizado correctamente', center });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Eliminar un centro deportivo (soft delete)
export const deleteCenter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { centerId } = req.params;

        const center = await Center.findById(centerId);
        if (!center) {
            res.status(404).send({ message: 'Centro no encontrado' });
            return;
        }

        center.isDeleted = true;
        center.deletedAt = new Date();
        await center.save();

        res.status(200).json({ message: 'Centro eliminado correctamente (soft delete)' });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Restaurar un centro deportivo eliminado
export const restoreCenter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { centerId } = req.params;

        const center = await Center.findOne({ _id: centerId, isDeleted: true });
        if (!center) {
            res.status(404).send({ message: 'Centro no encontrado o no está eliminado' });
            return;
        }

        center.isDeleted = false;
        center.deletedAt = null;
        await center.save();

        res.status(200).json({ message: 'Centro restaurado correctamente', center });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Asociar un partido a un centro deportivo
export const addMatchToCenter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { centerId, matchId } = req.params;

        const center: any = await Center.findById(centerId);
        const match: any = await Match.findById(matchId);

        if (!center) {
            res.status(404).send({ message: 'Centro no encontrado' });
            return;
        }
        if (!match) {
            res.status(404).send({ message: 'Partido no encontrado' });
            return;
        }

        // Verificar si el partido ya está asociado
        if (center.matches.includes(matchId)) {
            res.status(400).send({ message: 'El partido ya está asociado al centro' });
            return;
        }

        center.matches.push(matchId);
        await center.save();

        res.status(200).json({ message: 'Partido asociado al centro correctamente', center });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Listar los partidos asociados a un centro deportivo
export const listMatchesByCenter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { centerId } = req.params;

        const center = await Center.findById(centerId).populate('matches', 'name date');
        if (!center) {
            res.status(404).send({ message: 'Centro no encontrado' });
            return;
        }

        res.status(200).json({ matches: center.matches });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};
