/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Types } from 'mongoose';

// Interfaz para definir el modelo de Center
export interface ICenter extends Document {
    name: string; // Nombre del centro
    location: string; // Dirección o ubicación del centro
    facilities: string[]; // Instalaciones disponibles (e.g., "Cancha de fútbol", "Piscina")
    capacity: number; // Capacidad máxima de personas
    matches: Types.ObjectId[]; // Referencia a los partidos realizados en este centro
    isDeleted: boolean; // Soft delete
    deletedAt?: Date | null; // Fecha de eliminación
    createdAt: Date;
    updatedAt: Date;
    softDelete(): Promise<void>; // Método para realizar un soft delete
    restore(): Promise<void>; // Método para restaurar un centro eliminado
}

// Esquema de Mongoose
const CenterSchema = new Schema<ICenter>(
    {
        name: {
            type: String,
            required: [true, 'El nombre del centro es obligatorio'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'La ubicación del centro es obligatoria'],
            trim: true,
        },
        facilities: [
            {
                type: String,
                trim: true,
            },
        ],
        capacity: {
            type: Number,
            required: [true, 'La capacidad del centro es obligatoria'],
            min: [1, 'La capacidad debe ser al menos 1 persona'],
        },
        matches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Match', // Relación con el modelo Match
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

// Método para realizar un soft delete
CenterSchema.methods.softDelete = async function (): Promise<void> {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

// Método para restaurar un centro eliminado
CenterSchema.methods.restore = async function (): Promise<void> {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

// Crear el modelo de Mongoose
const Center = mongoose.model<ICenter>('Center', CenterSchema);

export default Center;
