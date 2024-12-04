import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para definir el modelo de Match
export interface IMatch extends Document {
    groupId: mongoose.Types.ObjectId;
    date: Date;
    location: string;
    players: mongoose.Types.ObjectId[]; // Lista de IDs de jugadores
}

// Esquema de Mongoose
const MatchSchema: Schema = new Schema(
    {
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }, // Incluye createdAt y updatedAt automáticamente
);

export default mongoose.model<IMatch>('Match', MatchSchema);
