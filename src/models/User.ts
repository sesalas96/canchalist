import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para definir el tipo del modelo
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

// Esquema de Mongoose
const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
