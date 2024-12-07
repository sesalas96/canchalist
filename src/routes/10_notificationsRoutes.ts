import { Router } from 'express';
import {
    createNotification,
    getNotificationById,
    markAsRead,
    deleteNotification,
    listUserNotifications,
    markAllAsRead,
} from '@src/controllers/10_notificationController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear una nueva notificación
router.post(ROUTES.NOTIFICATIONS.BASE, auth, createNotification);

// Obtener una notificación por ID
router.get(ROUTES.NOTIFICATIONS.BY_ID, auth, getNotificationById);

// Marcar una notificación como leída
router.put(ROUTES.NOTIFICATIONS.MARK_AS_READ, auth, markAsRead);

// Eliminar una notificación (soft delete)
router.delete(ROUTES.NOTIFICATIONS.BY_ID, auth, deleteNotification);

// Listar notificaciones de un usuario
router.get(ROUTES.NOTIFICATIONS.USER, auth, listUserNotifications);

// Marcar todas las notificaciones como leídas
router.put(ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ, auth, markAllAsRead);

export default router;
