/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Types, Query } from 'mongoose';

export interface IHistory extends Document {
    matchId: Types.ObjectId; // ID del partido asociado
    result: string; // Resultado del partido
    stats?: Record<string, any>; // Estadísticas del partido (goles, faltas, etc.)
    reviews: Types.ObjectId[]; // Array de IDs de reseñas relacionadas
    isDeleted: boolean; // Soft delete
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    softDelete(): Promise<void>; // Método para realizar un soft delete
    restore(): Promise<void>; // Método para restaurar un historial eliminado
}

const HistorySchema = new Schema<IHistory>(
    {
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Match',
            required: true,
        },
        result: {
            type: String,
            required: true,
            trim: true,
        },
        stats: {
            type: Object, // Flexible para cualquier dato de estadísticas
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review', // Relación con el modelo de Review
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Agrega automáticamente createdAt y updatedAt
    },
);

// Métodos para soft delete y restauración
HistorySchema.methods.softDelete = async function (): Promise<void> {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

HistorySchema.methods.restore = async function (): Promise<void> {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

// Pre-middleware para excluir registros eliminados en consultas
HistorySchema.pre<Query<any, Document>>(/^find/, function (next) {
    if (!this.getQuery().includeDeleted) {
        this.where({ isDeleted: false });
    } else {
        delete this.getQuery().includeDeleted; // Limpia el campo personalizado
    }
    next();
});

const History = mongoose.model<IHistory>('History', HistorySchema);

export default History;
