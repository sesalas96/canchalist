/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Match from '../models/4_Match';
import Group from '../models/3_Group';
import User from '../models/1_User';
import { SportType } from '@src/constants';

// Crear una nueva mejenga dentro de un grupo
export const createMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const { name, description, date, startTime, endTime, location, sportType, maxPlayers } =
            req.body;

        // Verificar si el grupo existe
        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).send({ message: 'Grupo no encontrado' });
            return;
        }

        // Validar que el tipo de deporte sea válido
        if (!Object.values(SportType).includes(sportType)) {
            res.status(400).send({ message: 'Tipo de deporte inválido' });
            return;
        }

        // Validar que la fecha y horas no estén en el pasado
        if (new Date(date) < new Date() || new Date(startTime) < new Date()) {
            res.status(400).send({ message: 'No puedes programar un partido en el pasado' });
            return;
        }

        // Crear la mejenga
        const newMatch = new Match({
            groupId,
            name,
            description,
            date,
            startTime,
            endTime,
            location,
            sportType,
            maxPlayers,
            players: [],
        });

        await newMatch.save();

        res.status(201).send({ message: 'Partido creado con éxito', match: newMatch });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener detalles de un partido específico
export const getMatchById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;

        const match = await Match.findOne({ _id: matchId, groupId })
            .populate('players', 'name email')
            .populate('groupId', 'name');

        if (!match) {
            res.status(404).send({ message: 'Partido no encontrado' });
            return;
        }

        res.status(200).send(match);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Listar partidos con filtros, paginación y ordenación
export const listMatches = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const {
            page = 1,
            limit = 10,
            sportType,
            status,
            sortBy = 'date',
            order = 'asc',
        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
            res.status(400).send({ message: 'Page y limit deben ser números positivos' });
            return;
        }

        const filters: any = { groupId };
        if (sportType) filters.sportType = sportType;
        if (status) filters.status = status;

        const skip = (pageNumber - 1) * limitNumber;
        const sortOrder = order === 'desc' ? -1 : 1;

        const matches = await Match.find(filters)
            .sort({ [sortBy as string]: sortOrder })
            .populate('players', 'name email')
            .skip(skip)
            .limit(limitNumber);

        const totalMatches = await Match.countDocuments(filters);
        const totalPages = Math.ceil(totalMatches / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalMatches,
            data: matches,
        });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Unirse a un partido
export const joinMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;
        const { userId } = req.body;

        const match = await Match.findOne({ _id: matchId, groupId });
        const user = await User.findById(userId);

        if (!match || !user) {
            res.status(404).send({ message: 'Partido o usuario no encontrado' });
            return;
        }

        if (match.players.includes(userId)) {
            res.status(400).send({ message: 'El usuario ya está en el partido' });
            return;
        }

        if (match.players.length >= match.maxPlayers) {
            res.status(400).send({
                message: 'El partido ya alcanzó el número máximo de jugadores',
            });
            return;
        }

        match.players.push(userId);
        await match.save();

        res.status(200).send({ message: 'Usuario añadido al partido', match });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Salir de un partido
export const leaveMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;
        const { userId } = req.body;

        const match = await Match.findOne({ _id: matchId, groupId });
        if (!match) {
            res.status(404).send({ message: 'Partido no encontrado' });
            return;
        }

        if (!match.players.includes(userId)) {
            res.status(400).send({ message: 'El usuario no está en el partido' });
            return;
        }

        match.players = match.players.filter((playerId: any) => playerId.toString() !== userId);
        await match.save();

        res.status(200).send({ message: 'Usuario eliminado del partido', match });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Actualizar un partido
export const updateMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matchId } = req.params;
        const {
            name,
            description,
            date,
            startTime,
            endTime,
            location,
            sportType,
            maxPlayers,
            players,
        } = req.body;

        // Buscar el partido por ID
        const match = await Match.findById(matchId);
        if (!match) {
            res.status(404).send({ message: 'Partido no encontrado' });
            return;
        }

        // Validar que el tipo de deporte sea un valor válido del enum SportType
        if (sportType && !Object.values(SportType).includes(sportType)) {
            res.status(400).send({
                message: `El tipo de deporte debe ser uno de: ${Object.values(SportType).join(', ')}`,
            });
            return;
        }

        // Validar que la hora de inicio y fin sean coherentes
        if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
            res.status(400).send({
                message: 'La hora de finalización debe ser posterior a la hora de inicio',
            });
            return;
        }

        // Actualizar los campos si están presentes en la solicitud
        if (name) match.name = name;
        if (description) match.description = description;
        if (date) match.date = new Date(date);
        if (startTime) match.startTime = new Date(startTime);
        if (endTime) match.endTime = new Date(endTime);
        if (location) match.location = location;
        if (sportType) match.sportType = sportType;
        if (maxPlayers) {
            if (maxPlayers < match.players.length) {
                res.status(400).send({
                    message: `El número máximo de jugadores (${maxPlayers}) no puede ser menor que los jugadores actuales (${match.players.length})`,
                });
                return;
            }
            match.maxPlayers = maxPlayers;
        }
        if (players) {
            if (players.length > match.maxPlayers) {
                res.status(400).send({
                    message: `El número de jugadores no puede exceder el máximo permitido (${match.maxPlayers})`,
                });
                return;
            }
            match.players = players;
        }

        // Guardar los cambios en la base de datos
        await match.save();

        res.status(200).send({ message: 'Partido actualizado correctamente', match });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

export const deleteMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;

        // Verificar si el partido existe dentro del grupo
        const match = await Match.findOne({ _id: matchId, groupId });
        if (!match) {
            res.status(404).send({ message: 'Partido no encontrado' });
            return;
        }

        // Realizar el soft delete
        await match.softDelete();

        res.status(200).send({ message: 'Partido eliminado correctamente (soft delete)', match });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

export const restoreMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, matchId } = req.params;

        // Buscar el partido eliminado por ID y grupo
        const match = await Match.findOne({ _id: matchId, groupId, isDeleted: true });
        if (!match) {
            res.status(404).send({ message: 'Partido no encontrado o no está eliminado' });
            return;
        }

        // Restaurar el partido usando el método definido en el esquema
        await match.restore();

        res.status(200).send({ message: 'Partido restaurado correctamente', match });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};
