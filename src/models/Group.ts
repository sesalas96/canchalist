import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para definir el modelo de grupo
export interface IGroup extends Document {
    name: string;
    description?: string;
    members: mongoose.Types.ObjectId[];
}

// Esquema de Mongoose
const GroupSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);

export default mongoose.model<IGroup>('Group', GroupSchema);
