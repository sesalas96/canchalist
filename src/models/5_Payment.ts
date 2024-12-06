/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

// Interfaz para definir el modelo de Payment
export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    matchId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string; // Ej.: 'credit_card', 'paypal'
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    deletedAt?: Date | null;
}

// Esquema de Mongoose
const PaymentSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        paymentMethod: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Middleware para excluir los documentos eliminados
// PaymentSchema.pre<Query<any, Document>>(/^find/, function (next) {
//     this.where({ isDeleted: false });
//     next();
// });

PaymentSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

PaymentSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IPayment>('Payment', PaymentSchema);
