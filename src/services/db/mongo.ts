import mongoose from 'mongoose';

const connectMongo = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('Falta la variable MONGO_URI en el archivo .env');
        }

        await mongoose.connect(mongoUri, { maxPoolSize: 30 });
        console.log('Conexión a MongoDB establecida correctamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1); // Salir del proceso si no se puede conectar
    }
};

export default connectMongo;
