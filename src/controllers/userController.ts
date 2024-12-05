/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@src/config';

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).send({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).send(user);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Registrar un nuevo usuario
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validación básica
        if (!name || !email || !password) {
            res.status(400).send({ message: 'Todos los campos son obligatorios' });
            return;
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).send({ message: 'El correo electrónico ya está registrado' });
            return;
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).send({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Inicio de sesión
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validación básica
        if (!email || !password) {
            res.status(400).send({ message: 'Correo y contraseña son obligatorios' });
            return;
        }

        // Buscar usuario por correo
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send({ message: 'Usuario no encontrado' });
            return;
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send({ message: 'Contraseña incorrecta' });
            return;
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret as string, {
            expiresIn: '1h',
        });

        res.status(200).send({ message: 'Inicio de sesión exitoso', token });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Eliminar un usuario (soft)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Buscar el usuario por ID
        const user: any = await User.findById(id);
        if (!user) {
            res.status(404).send({ message: 'Usuario no encontrado' });
            return;
        }

        // Realizar el soft delete usando el método del esquema
        await user.softDelete();

        res.status(200).send({ message: 'Usuario eliminado correctamente (soft delete)', user });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

// Recuperar un usuario (soft)
export const restoreUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Buscar el usuario eliminado por ID
        const user: any = await User.findOne({ _id: id });
        if (!user) {
            res.status(404).send({ message: 'Usuario no encontrado o no está eliminado' });
            return;
        }

        // Restaurar el usuario usando el método del esquema
        await user.restore();

        res.status(200).send({ message: 'Usuario restaurado correctamente', user });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};
