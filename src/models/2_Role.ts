/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

// Interfaz para definir el modelo de Role
export interface IRole extends Document {
    userId: mongoose.Types.ObjectId; // Usuario asociado
    role: 'admin' | 'organizer' | 'player'; // Tipo de rol
    groupId?: mongoose.Types.ObjectId; // Grupo asociado (opcional)
    isDeleted: boolean; // Eliminación lógica
    deletedAt?: Date | null; // Fecha de eliminación lógica
    createdAt: Date;
    updatedAt?: Date;
}

// Esquema de Mongoose
const RoleSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'organizer', 'player'], required: true },
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Métodos para soft delete y restauración
RoleSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

RoleSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IRole>('Role', RoleSchema);
