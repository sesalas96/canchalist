/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para definir el modelo de Plan
export interface IPlan extends Document {
    name: string; // Nombre del plan
    price: number; // Precio del plan
    description?: string; // Descripción del plan
    durationInDays: number; // Duración del plan en días
    isActive: boolean; // Si el plan está disponible
    isDeleted: boolean; // Eliminación lógica
    deletedAt?: Date | null; // Fecha de eliminación lógica
    createdAt: Date;
    updatedAt?: Date;
}

// Esquema de Mongoose
const PlanSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true }, // Nombre único del plan
        price: { type: Number, required: true },
        description: { type: String },
        durationInDays: { type: Number, required: true }, // Ej.: 30 días para mensual
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Métodos para soft delete y restauración
PlanSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.isActive = false;
    this.deletedAt = new Date();
    await this.save();
};

PlanSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.isActive = true;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IPlan>('Plan', PlanSchema);
