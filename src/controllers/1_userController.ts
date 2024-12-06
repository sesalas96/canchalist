/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import User from '../models/1_User';
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
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validación de datos requeridos
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Buscar usuario por email
        const user: any = await User.findOne({ email });

        if (!user || user.isDeleted) {
            return res.status(404).json({ message: 'Invalid email or user does not exist.' });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Generar token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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

//Actualizar usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        // Buscar el usuario por ID
        const user = await User.findById(id);
        if (!user) {
            res.status(404).send({ message: 'Usuario no encontrado' });
            return;
        }

        // Actualizar los campos permitidos
        if (name) user.name = name;
        if (email) user.email = email;

        // Si hay una contraseña en la solicitud, hashearla antes de guardarla
        if (password) {
            const saltRounds = 10; // Número de rondas de sal
            user.password = await bcrypt.hash(password, saltRounds);
        }

        await user.save();

        res.status(200).send({ message: 'Usuario actualizado correctamente', user });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};
