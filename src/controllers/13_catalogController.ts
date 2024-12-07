/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import {
    SportType,
    Currency,
    NotificationType,
    PaymentMethod,
    PaymentStatus,
} from '@src/constants';

// Devuelve todos los catálogos
export const getAllCatalogs = (_: Request, res: Response): void => {
    try {
        const catalogs = {
            sportTypes: Object.values(SportType),
            currencies: Object.values(Currency),
            notificationTypes: Object.values(NotificationType),
            paymentMethods: Object.values(PaymentMethod),
            paymentStatuses: Object.values(PaymentStatus),
        };

        res.status(200).json(catalogs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Devuelve un catálogo específico
export const getCatalogByName = (req: Request, res: Response): void => {
    try {
        const { catalogName } = req.params;

        const catalogMap: Record<string, any> = {
            sportTypes: Object.values(SportType),
            currencies: Object.values(Currency),
            notificationTypes: Object.values(NotificationType),
            paymentMethods: Object.values(PaymentMethod),
            paymentStatuses: Object.values(PaymentStatus),
        };

        const catalog = catalogMap[catalogName];
        if (!catalog) {
            res.status(404).json({ message: `Catalog '${catalogName}' not found.` });
            return;
        }

        res.status(200).json({ [catalogName]: catalog });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
