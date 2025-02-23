/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema, Query } from 'mongoose';
import bcrypt from 'bcrypt';

// Interfaz para definir el tipo del modelo
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isDeleted: boolean;
    deletedAt?: Date | null;
}

// Esquema de Mongoose
const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true },
);

// Allow recovery
// Middleware para excluir los documentos eliminados
// UserSchema.pre<Query<any, Document>>(/^find/, function (next) {
//     this.where({ isDeleted: false });
//     next();
// });

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

UserSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IUser>('User', UserSchema);
