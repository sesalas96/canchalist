/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

// Interfaz para definir el modelo de Review
export interface IReview extends Document {
    matchId: mongoose.Types.ObjectId; // Partido relacionado
    reviewerId: mongoose.Types.ObjectId; // Usuario que realiza la reseña
    targetId: mongoose.Types.ObjectId; // Usuario o grupo reseñado
    rating: number; // Calificación (1 a 5)
    comment?: string; // Comentario opcional
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt?: Date;
}

// Esquema de Mongoose
const ReviewSchema: Schema = new Schema(
    {
        matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, maxlength: 500 },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Métodos para soft delete y restauración
ReviewSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

ReviewSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IReview>('Review', ReviewSchema);
