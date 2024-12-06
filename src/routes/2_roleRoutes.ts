import express from 'express';
import * as roleController from '@src/controllers/2_roleController';

const router = express.Router();

// Rutas para Roles

// Crear un nuevo rol
router.post('/roles', roleController.createRole);

// Obtener un rol por su ID
router.get('/roles/:roleId', roleController.getRoleById);

// Actualizar un rol
router.patch('/roles/:roleId', roleController.updateRole);

// Eliminar un rol (soft delete)
router.delete('/roles/:roleId', roleController.deleteRole);

// Restaurar un rol eliminado
router.post('/roles/:roleId/restore', roleController.restoreRole);

// Listar roles con filtros opcionales
router.get('/roles', roleController.listRoles);

export default router;
