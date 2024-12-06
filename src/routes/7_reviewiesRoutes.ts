import { Router } from 'express';
import * as reviewController from '../controllers/7_reviewController';

const router = Router();

// Rutas para Reviews

// Crear una nueva reseña
router.post('/reviews', reviewController.createReview);

// Obtener una reseña por su ID
router.get('/reviews/:reviewId', reviewController.getReviewById);

// Actualizar una reseña
router.patch('/reviews/:reviewId', reviewController.updateReview);

// Eliminar una reseña (soft delete)
router.delete('/reviews/:reviewId', reviewController.deleteReview);

// Restaurar una reseña eliminada
router.post('/reviews/:reviewId/restore', reviewController.restoreReview);

// Listar reseñas con filtros opcionales
router.get('/reviews', reviewController.listReviews);

export default router;
