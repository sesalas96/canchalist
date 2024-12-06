import express from 'express';

const router = express.Router();

import * as notificationController from '../controllers/8_notificationController';

// Rutas para Notificaciones

// Crear una nueva notificación
router.post('/notifications', notificationController.createNotification);

// Obtener una notificación por su ID
router.get('/notifications/:notificationId', notificationController.getNotificationById);

// Marcar una notificación como leída
router.patch('/notifications/:notificationId/read', notificationController.markAsRead);

// Eliminar una notificación (soft delete)
router.delete('/notifications/:notificationId', notificationController.deleteNotification);

// Listar notificaciones de un usuario
router.get('/notifications/user/:userId', notificationController.listUserNotifications);

export default router;
