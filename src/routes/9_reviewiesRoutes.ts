import { Router } from 'express';
import {
    createReview,
    getReviewById,
    updateReview,
    deleteReview,
    restoreReview,
    listReviews,
} from '@src/controllers/9_reviewController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear una nueva reseña
router.post(ROUTES.REVIEWS.BASE, auth, createReview);

// Obtener una reseña por su ID
router.get(ROUTES.REVIEWS.BY_ID, auth, getReviewById);

// Actualizar una reseña
router.put(ROUTES.REVIEWS.BY_ID, auth, updateReview);

// Eliminar una reseña (soft delete)
router.delete(ROUTES.REVIEWS.BY_ID, auth, deleteReview);

// Restaurar una reseña eliminada
router.post(ROUTES.REVIEWS.RESTORE, auth, restoreReview);

// Listar todas las reseñas
router.get(ROUTES.REVIEWS.LIST, auth, listReviews);

export default router;
