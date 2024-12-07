/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency, PaymentStatus } from '@src/constants';
import mongoose, { Schema, Document, Types } from 'mongoose';

// Interfaz para el modelo de Payment
export interface IPayment extends Document {
    userId: Types.ObjectId; // ID del usuario que realiza el pago
    matchId: Types.ObjectId; // ID del partido al que está asociado (opcional)
    amount: number; // Monto del pago
    currency: string; // Moneda del pago
    method: string; // Método de pago (e.g., tarjeta, transferencia)
    status: PaymentStatus; // Estado del pago
    transactionId?: string; // ID de la transacción externa (opcional)
    createdAt: Date;
    updatedAt: Date;
}

// Esquema de Mongoose para Payment
const PaymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El ID del usuario es obligatorio'],
        },
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Match',
        },
        amount: {
            type: Number,
            required: [true, 'El monto del pago es obligatorio'],
            min: [0.01, 'El monto debe ser mayor a 0'],
        },
        currency: {
            type: String,
            enum: Object.values(Currency),
            required: [true, 'La moneda es obligatoria'],
            trim: true,
        },
        method: {
            type: String,
            required: [true, 'El método de pago es obligatorio'],
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.Pending,
        },
        transactionId: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Agrega automáticamente createdAt y updatedAt
    },
);

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
