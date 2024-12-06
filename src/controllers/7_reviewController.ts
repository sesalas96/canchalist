/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Review from '@src/models/7_Review';
import { Request, Response } from 'express';

// Crear una nueva reseña
export const createReview = async (req: Request, res: Response) => {
    try {
        const { matchId, reviewerId, targetId, rating, comment } = req.body;

        if (!matchId || !reviewerId || !targetId || !rating) {
            return res
                .status(400)
                .json({ message: 'matchId, reviewerId, targetId, and rating are required.' });
        }

        const review = await Review.create({
            matchId,
            reviewerId,
            targetId,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una reseña por su ID
export const getReviewById = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review || review.isDeleted) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        res.status(200).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una reseña
export const updateReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);

        if (!review || review.isDeleted) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        review.updatedAt = new Date();

        await review.save();

        res.status(200).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una reseña (soft delete)
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;

        const review: any = await Review.findById(reviewId);

        if (!review || review.isDeleted) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        await review.softDelete();

        res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Restaurar una reseña eliminada
export const restoreReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;

        const review: any = await Review.findById(reviewId);

        if (!review || !review.isDeleted) {
            return res.status(404).json({ message: 'Review not found or not deleted.' });
        }

        await review.restore();

        res.status(200).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Listar reseñas con filtros opcionales
export const listReviews = async (req: Request, res: Response) => {
    try {
        const filters: any = {
            ...req.query,
            isDeleted: false,
        };

        const reviews = await Review.find(filters)
            .populate('matchId')
            .populate('reviewerId', 'name') // Opcional: solo devuelve el campo `name`
            .populate('targetId', 'name');

        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
