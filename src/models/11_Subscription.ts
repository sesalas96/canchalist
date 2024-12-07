import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    userId: Types.ObjectId;
    plan: string;
    planId: Types.ObjectId; // Referencia al Plan
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    softDelete(): Promise<void>;
    restore(): Promise<void>;
}

// Esquema de Mongoose
const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        plan: {
            type: String,
            required: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan', // Referencia al modelo de planes
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

// Métodos personalizados (soft delete, restore)
SubscriptionSchema.methods.softDelete = async function (): Promise<void> {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

SubscriptionSchema.methods.restore = async function (): Promise<void> {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
