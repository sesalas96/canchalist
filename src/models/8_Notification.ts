/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

// Interfaz para definir el modelo de Notificación
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId; // Usuario destinatario
    message: string; // Mensaje de la notificación
    type: 'match_update' | 'payment' | 'reminder' | 'general'; // Tipo de notificación
    read: boolean; // Si el usuario ha leído la notificación
    isDeleted: boolean; // Eliminación lógica
    deletedAt?: Date | null; // Fecha de eliminación lógica
    createdAt: Date;
    updatedAt?: Date;
}

// Esquema de Mongoose
const NotificationSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['match_update', 'payment', 'reminder', 'general'],
            default: 'general',
        },
        read: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Métodos para marcar como leído
NotificationSchema.methods.markAsRead = async function () {
    this.read = true;
    await this.save();
};

// Métodos para soft delete
NotificationSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

export default mongoose.model<INotification>('Notification', NotificationSchema);
