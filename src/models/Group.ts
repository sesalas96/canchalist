/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';

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
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true },
);

// Middleware para excluir grupos eliminados de las consultas
// GroupSchema.pre<Query<any, Document>>(/^find/, function (next) {
//     this.where({ isDeleted: false });
//     next();
// });

GroupSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

GroupSchema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

export default mongoose.model<IGroup>('Group', GroupSchema);
