/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para definir el modelo de Subscription
export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId; // Usuario que posee la suscripción
    plan: string; // Nombre del plan asociado
    startDate: Date; // Fecha de inicio
    endDate: Date; // Fecha de fin
    isActive: boolean; // Si la suscripción está activa
    isDeleted: boolean; // Eliminación lógica
    deletedAt?: Date | null; // Fecha de eliminación lógica
    createdAt: Date;
    updatedAt?: Date;
}

// Esquema de Mongoose
const SubscriptionSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        plan: { type: String, required: true }, // Guardar el nombre del plan
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

SubscriptionSchema.index({ endDate: 1, isActive: 1 });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
