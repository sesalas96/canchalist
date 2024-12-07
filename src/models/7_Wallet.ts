/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency } from '@src/constants';
import mongoose, { Schema, Document, Types } from 'mongoose';

// Interfaz para el modelo de Wallet
export interface IWallet extends Document {
    userId: Types.ObjectId; // ID del usuario al que pertenece la billetera
    balance: number; // Saldo actual
    currency: Currency; // Moneda de la billetera
    transactions: Types.ObjectId[]; // Referencia a los pagos realizados
    createdAt: Date; // Fecha de creación
    updatedAt: Date; // Fecha de última actualización
    addFunds(amount: number): Promise<void>; // Método para agregar fondos
    deductFunds(amount: number): Promise<void>; // Método para deducir fondos
}

// Esquema de Mongoose para Wallet
const WalletSchema = new Schema<IWallet>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El ID del usuario es obligatorio'],
            unique: true, // Cada usuario tiene una billetera única
        },
        balance: {
            type: Number,
            default: 0,
            min: [0, 'El saldo no puede ser negativo'],
        },
        currency: {
            type: String,
            enum: Object.values(Currency), // Validación con el enum de monedas
            required: [true, 'La moneda de la billetera es obligatoria'],
            trim: true,
        },
        transactions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payment',
            },
        ],
    },
    {
        timestamps: true, // Agrega automáticamente createdAt y updatedAt
    },
);

// Método para agregar fondos
WalletSchema.methods.addFunds = async function (amount: number): Promise<void> {
    if (amount <= 0) {
        throw new Error('El monto debe ser mayor a 0');
    }
    this.balance += amount;
    await this.save();
};

// Método para deducir fondos
WalletSchema.methods.deductFunds = async function (amount: number): Promise<void> {
    if (amount > this.balance) {
        throw new Error('Fondos insuficientes');
    }
    this.balance -= amount;
    await this.save();
};

// Crear el modelo de Mongoose
const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
export default Wallet;
