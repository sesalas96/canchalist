/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Review from '@src/models/9_Review';
import History from '@src/models/8_History';
import User from '@src/models/1_User';

export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matchId, reviewerId, targetId, rating, comment } = req.body;

        if (!targetId) {
            res.status(400).json({ message: 'El campo targetId es obligatorio.' });
            return;
        }

        const targetUser = await User.findById(targetId);
        if (!targetUser) {
            res.status(404).json({ message: 'El usuario objetivo no existe.' });
            return;
        }

        if (!matchId || !reviewerId || !targetId || !rating) {
            res.status(400).json({
                message: 'matchId, reviewerId, targetId, and rating are required.',
            });
            return;
        }

        if (rating < 1 || rating > 5) {
            res.status(400).json({
                message: 'Rating must be between 1 and 5.',
            });
            return;
        }

        const review: any = await Review.create({
            matchId,
            reviewerId,
            targetId,
            rating,
            comment,
        });

        // Agregar la reseña al historial asociado
        const history = await History.findOne({ matchId });
        if (history) {
            history.reviews.push(review._id);
            await history.save();
        }

        res.status(201).json({
            message: 'Review created successfully',
            review,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una reseña por su ID
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId)
            .populate('matchId')
            .populate('reviewerId', 'name email') // Devuelve solo nombre y correo del revisor
            .populate('targetId', 'name email'); // Devuelve solo nombre y correo del objetivo

        if (!review || review.isDeleted) {
            res.status(404).json({ message: 'Review not found.' });
            return;
        }

        res.status(200).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una reseña
export const updateReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);

        if (!review || review.isDeleted) {
            res.status(404).json({ message: 'Review not found.' });
            return;
        }

        if (rating) {
            // Validar que la calificación esté en el rango esperado
            if (rating < 1 || rating > 5) {
                res.status(400).json({
                    message: 'Rating must be between 1 and 5.',
                });
                return;
            }
            review.rating = rating;
        }

        if (comment) review.comment = comment;

        review.updatedAt = new Date();
        await review.save();

        res.status(200).json({
            message: 'Review updated successfully',
            review,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una reseña (soft delete)
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewId } = req.params;

        const review: any = await Review.findById(reviewId);

        if (!review || review.isDeleted) {
            res.status(404).json({ message: 'Review not found.' });
            return;
        }

        await review.softDelete();

        res.status(200).json({
            message: 'Review deleted successfully.',
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar una reseña eliminada
export const restoreReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewId } = req.params;

        const review: any = await Review.findById(reviewId);

        if (!review || !review.isDeleted) {
            res.status(404).json({
                message: 'Review not found or not deleted.',
            });
            return;
        }

        await review.restore();

        res.status(200).json({
            message: 'Review restored successfully.',
            review,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar reseñas con filtros opcionales
export const listReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matchId, targetId, reviewerId, page = 1, limit = 10 } = req.query;

        const filters: any = {
            isDeleted: false,
        };

        if (matchId) filters.matchId = matchId;
        if (targetId) filters.targetId = targetId;
        if (reviewerId) filters.reviewerId = reviewerId;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const reviews = await Review.find(filters)
            .populate('matchId')
            .populate('reviewerId', 'name')
            .populate('targetId', 'name')
            .skip(skip)
            .limit(limitNumber);

        const totalReviews = await Review.countDocuments(filters);
        const totalPages = Math.ceil(totalReviews / limitNumber);

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalReviews,
            data: reviews,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
