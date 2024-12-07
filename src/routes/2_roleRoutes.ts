import express from 'express';
import * as roleController from '@src/controllers/2_roleController';
import { ROUTES } from '@src/constants';

const router = express.Router();

// Rutas para Roles

// Crear un nuevo rol
router.post(ROUTES.ROLES.BASE, roleController.createRole);

// Obtener un rol por su ID
router.get(ROUTES.ROLES.BY_ID, roleController.getRoleById);

// Actualizar un rol
router.patch(ROUTES.ROLES.PATCH, roleController.updateRole);

// Eliminar un rol (soft delete)
router.delete(ROUTES.ROLES.DELETE, roleController.deleteRole);

// Restaurar un rol eliminado
router.post(ROUTES.ROLES.RESTORE, roleController.restoreRole);

// Listar roles con filtros opcionales
router.get(ROUTES.ROLES.LIST, roleController.listRoles);

export default router;
