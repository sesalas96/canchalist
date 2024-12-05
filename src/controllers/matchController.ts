/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Match from '../models/Match';
import Group from '../models/Group';
import User from '../models/User';

// Crear una nueva mejenga dentro de un grupo
export const createMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const { date, location } = req.body;

        // Verificar si el grupo existe
        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).send({ message: 'Grupo no encontrado' });
            return;
        }

        // Crear la mejenga
        const newMatch = new Match({ groupId, date, location, players: [] });
        await newMatch.save();

        res.status(201).send({ message: 'Mejenga creada con éxito', match: newMatch });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener detalles de una mejenga específica
export const getMatchById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;

        // Verificar si la mejenga pertenece al grupo
        const match = await Match.findOne({ _id: matchId, groupId }).populate(
            'players',
            'name email',
        );
        if (!match) {
            res.status(404).send({ message: 'Mejenga no encontrada' });
            return;
        }

        res.status(200).send(match);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Unirse a una mejenga
export const joinMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;
        const { userId } = req.body;

        // Verificar si el usuario y la mejenga existen
        const match = await Match.findOne({ _id: matchId, groupId });
        const user = await User.findById(userId);

        if (!match || !user) {
            res.status(404).send({ message: 'Mejenga o usuario no encontrado' });
            return;
        }

        // Verificar si el usuario ya está en la mejenga
        if (match.players.includes(userId)) {
            res.status(400).send({ message: 'El usuario ya está en la mejenga' });
            return;
        }

        // Agregar al usuario a la mejenga
        match.players.push(userId);
        await match.save();

        res.status(200).send({ message: 'Usuario añadido a la mejenga', match });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Soft delete a una mejenga
export const deleteMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;

        console.log(req.params);

        // Verificar si el match existe dentro del grupo
        const match: any = await Match.findOne({ _id: matchId, groupId });
        if (!match) {
            res.status(404).send({ message: 'Mejenga no encontrada' });
            return;
        }

        // Soft delete
        await match.softDelete();

        res.status(200).send({ message: 'Mejenga eliminada correctamente' });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};
