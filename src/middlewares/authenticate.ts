/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@src/config';
import logger from '@src/lib/logger';
import { isTokenRevoked } from '@src/controllers/1_userController';

export const auth = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).send({ message: 'Acceso denegado' });
        return;
    }

    try {
        // Verifica si el token ha sido revocado
        const revoked = await isTokenRevoked(token);
        if (revoked) {
            res.status(401).send({
                message: 'Token revocado. Por favor, inicia sesión nuevamente.',
            });
            return;
        }

        // Verifica y decodifica el token
        const decoded = jwt.verify(token, config.jwtSecret as string);
        req.user = decoded; // Agrega el usuario decodificado al objeto `req`
        next();
    } catch (error: any) {
        logger.logErrorFlow(error);

        // Verifica el tipo de error del token
        if (error.name === 'TokenExpiredError') {
            res.status(401).send({
                message: 'El token ha expirado. Por favor, inicia sesión nuevamente.',
            });
        } else {
            res.status(403).send({ message: 'Token inválido' });
        }
    }
};
