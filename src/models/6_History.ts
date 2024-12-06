/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

// Interfaz para definir el modelo de History
export interface IHistory extends Document {
    matchId: mongoose.Types.ObjectId;
    result: string; // Ej.: "Team A 3-2 Team B"
    stats: Record<string, any>; // Ej.: { goals: 3, fouls: 1 }
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt?: Date;
}

// Esquema de Mongoose
const HistorySchema: Schema = new Schema(
    {
        matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
        result: { type: String, required: true },
        stats: { type: Object, required: false }, // Estadísticas del partido
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Métodos para soft delete y restauración
HistorySchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

HistorySchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IHistory>('History', HistorySchema);
