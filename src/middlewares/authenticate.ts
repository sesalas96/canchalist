/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@src/config';
import logger from '@src/lib/logger';

export const auth = (req: any, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).send({ message: 'Acceso denegado' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret as string);
        req.user = decoded;
        next();
    } catch (error) {
        logger.logErrorFlow(error);
        res.status(403).send({ message: 'Token inválido' });
    }
};
