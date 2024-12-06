/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Notification from '@src/models/8_Notification';
import { Request, Response } from 'express';

// Crear una nueva notificación
export const createNotification = async (req: Request, res: Response) => {
    try {
        const { userId, message, type } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'userId and message are required.' });
        }

        const notification = await Notification.create({
            userId,
            message,
            type,
        });

        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una notificación por su ID
export const getNotificationById = async (req: Request, res: Response) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findById(notificationId);

        if (!notification || notification.isDeleted) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Marcar una notificación como leída
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { notificationId } = req.params;

        const notification: any = await Notification.findById(notificationId);

        if (!notification || notification.isDeleted) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        await notification.markAsRead();

        res.status(200).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una notificación (soft delete)
export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { notificationId } = req.params;

        const notification: any = await Notification.findById(notificationId);

        if (!notification || notification.isDeleted) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        await notification.softDelete();

        res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar notificaciones de un usuario
export const listUserNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const filters: any = {
            userId,
            isDeleted: false,
        };

        const notifications = await Notification.find(filters).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Marcar notificaciones de un usuario como leidas
export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        await Notification.updateMany({ userId, read: false }, { read: true });

        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
