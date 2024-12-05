/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

// Interfaz para definir el modelo de Match
export interface IMatch extends Document {
    groupId: mongoose.Types.ObjectId;
    date: Date;
    location: string;
    players: mongoose.Types.ObjectId[]; // Lista de IDs de jugadores
    isDeleted: boolean;
    deletedAt?: Date | null;
}

// Esquema de Mongoose
const MatchSchema: Schema = new Schema(
    {
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

// Middleware para excluir los documentos eliminados
MatchSchema.pre<Query<any, Document>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

MatchSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

MatchSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IMatch>('Match', MatchSchema);
