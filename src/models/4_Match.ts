/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SportType } from '@src/constants';
import mongoose, { Schema, Document, Types, Query } from 'mongoose';

// Interfaz para definir el modelo de Match con tipos de deporte
export interface IMatch extends Document {
    groupId: Types.ObjectId; // ID del grupo al que pertenece
    centerId: Types.ObjectId; // ID del centro donde se realizara el match
    name: string;
    description: string;
    date: Date; // Fecha y hora de inicio del partido
    startTime: Date; // Hora de inicio exacta
    endTime: Date; // Hora de finalización exacta
    location: string; // Lugar donde se llevará a cabo
    sportType: SportType; // Tipo de deporte
    players: Types.ObjectId[]; // Array de IDs de usuarios que se unieron
    maxPlayers: number; // Número máximo de jugadores permitidos
    status: 'Pendiente' | 'En curso' | 'Finalizado'; // Estado del partido
    isDeleted: boolean; // Soft delete
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    softDelete(): Promise<void>; // Método para realizar un soft delete
    restore(): Promise<void>; // Método para restaurar un partido eliminado
    updateStatus(): void; // Actualizar estado del partido
}

// Esquema de Mongoose
const MatchSchema = new Schema<IMatch>(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: [true, 'El ID del grupo es obligatorio'],
        },
        centerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Center',
            required: [false, 'El ID del centro es obligatorio'],
        },
        name: {
            type: String,
            required: [true, 'El nombre del partido es obligatorio'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'La fecha del partido es obligatoria'],
        },
        startTime: {
            type: Date,
            required: [true, 'La hora de inicio es obligatoria'],
        },
        endTime: {
            type: Date,
            required: [true, 'La hora de finalización es obligatoria'],
            validate: {
                validator: function (value: Date): boolean {
                    return value > this.startTime;
                },
                message: 'La hora de finalización debe ser después de la hora de inicio',
            },
        },
        location: {
            type: String,
            required: [true, 'La ubicación del partido es obligatoria'],
            trim: true,
        },
        sportType: {
            type: String,
            enum: Object.values(SportType), // Validar que sea uno de los valores definidos
            required: [true, 'El tipo de deporte es obligatorio'],
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        maxPlayers: {
            type: Number,
            required: [true, 'El número máximo de jugadores es obligatorio'],
            min: [1, 'Debe haber al menos un jugador permitido'],
        },
        status: {
            type: String,
            enum: ['Pendiente', 'En curso', 'Finalizado'],
            default: 'Pendiente',
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true, // Para optimizar consultas frecuentes
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Agrega automáticamente `createdAt` y `updatedAt`
    },
);

// Middleware pre para excluir partidos eliminados en consultas `find` y `findOne`
MatchSchema.pre<Query<any, Document>>(/^find/, function (next) {
    if (!this.getQuery().includeDeleted) {
        this.where({ isDeleted: false });
    } else {
        delete this.getQuery().includeDeleted; // Limpia el campo personalizado
    }
    next();
});

// Método para realizar un soft delete
MatchSchema.methods.softDelete = async function (): Promise<void> {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

// Método para restaurar un partido eliminado
MatchSchema.methods.restore = async function (): Promise<void> {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
};

// Método para actualizar el estado del partido basado en el tiempo actual
MatchSchema.methods.updateStatus = function (): void {
    const now = new Date();
    if (now < this.startTime) {
        this.status = 'Pendiente';
    } else if (now >= this.startTime && now <= this.endTime) {
        this.status = 'En curso';
    } else if (now > this.endTime) {
        this.status = 'Finalizado';
    }
};

// Middleware pre-save para actualizar el estado antes de guardar
MatchSchema.pre('save', function (next) {
    this.updateStatus();
    next();
});

// Crear el modelo de Mongoose
const Match = mongoose.model<IMatch>('Match', MatchSchema);

export default Match;
