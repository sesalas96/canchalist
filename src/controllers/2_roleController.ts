/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Role from '@src/models/2_Role';
import { Request, Response } from 'express';

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response) => {
    try {
        const { userId, role, groupId } = req.body;

        if (!userId || !role) {
            return res.status(400).json({ message: 'userId and role are required.' });
        }

        const newRole = await Role.create({
            userId,
            role,
            groupId,
        });

        res.status(201).json(newRole);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un rol por su ID
export const getRoleById = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;

        const role = await Role.findById(roleId);

        if (!role || role.isDeleted) {
            return res.status(404).json({ message: 'Role not found.' });
        }

        res.status(200).json(role);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un rol
export const updateRole = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;
        const { role, groupId } = req.body;

        const roleRecord = await Role.findById(roleId);

        if (!roleRecord || roleRecord.isDeleted) {
            return res.status(404).json({ message: 'Role not found.' });
        }

        if (role) roleRecord.role = role;
        if (groupId) roleRecord.groupId = groupId;
        roleRecord.updatedAt = new Date();

        await roleRecord.save();

        res.status(200).json(roleRecord);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un rol (soft delete)
export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;

        const role: any = await Role.findById(roleId);

        if (!role || role.isDeleted) {
            return res.status(404).json({ message: 'Role not found.' });
        }

        await role.softDelete();

        res.status(200).json({ message: 'Role deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar un rol eliminado
export const restoreRole = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;

        const role: any = await Role.findById(roleId);

        if (!role || !role.isDeleted) {
            return res.status(404).json({ message: 'Role not found or not deleted.' });
        }

        await role.restore();

        res.status(200).json(role);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar roles con filtros opcionales y paginación
export const listRoles = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, ...queryFilters } = req.query;

        // Asegúrate de que `page` y `limit` sean números
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
            return res.status(400).json({ message: 'Page and limit must be positive numbers.' });
        }

        // Construir filtros dinámicamente
        const filters: any = {
            ...queryFilters,
            isDeleted: false,
        };

        // Calcular `skip` para paginación
        const skip = (pageNumber - 1) * limitNumber;

        // Consulta a la base de datos con paginación
        const roles = await Role.find(filters)
            .populate('userId', 'name email') // Devuelve campos específicos del usuario
            .populate('groupId', 'name') // Devuelve campos específicos del grupo
            .skip(skip)
            .limit(limitNumber);

        // Contar el número total de roles que cumplen los filtros
        const totalRoles = await Role.countDocuments(filters);

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalRoles / limitNumber);

        // Respuesta
        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalRoles,
            data: roles,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
