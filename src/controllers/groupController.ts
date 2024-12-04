/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import User from '@src/models/User';
import Group from '@src/models/Group';

// Crear un grupo
export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).send({ message: 'El nombre del grupo es obligatorio' });
            return;
        }

        const newGroup = new Group({ name, description, members: [] });
        await newGroup.save();

        res.status(201).send({ message: 'Grupo creado con éxito', group: newGroup });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener detalles de un grupo por ID
export const getGroupById = async (req: Request, res: Response): Promise<void> => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email');
        if (!group) {
            res.status(404).send({ message: 'Grupo no encontrado' });
            return;
        }
        res.status(200).send(group);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Unirse a un grupo
export const joinGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body; // ID del usuario que se unirá al grupo
        const group = await Group.findById(req.params.id);
        const user = await User.findById(userId);

        if (!group || !user) {
            res.status(404).send({ message: 'Grupo o usuario no encontrado' });
            return;
        }

        // Verificar si el usuario ya es miembro
        if (group.members.includes(userId)) {
            res.status(400).send({ message: 'El usuario ya es miembro del grupo' });
            return;
        }

        group.members.push(userId);
        await group.save();

        res.status(200).send({ message: 'Usuario añadido al grupo', group });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Listar miembros de un grupo
export const getGroupMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email');
        if (!group) {
            res.status(404).send({ message: 'Grupo no encontrado' });
            return;
        }
        res.status(200).send({ members: group.members });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};
