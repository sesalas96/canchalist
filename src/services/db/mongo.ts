/* eslint-disable object-curly-spacing */
import { MongoClient, Db } from 'mongodb';
import config from '@src/config';

// Configurar el cliente de MongoDB con el DSN y opciones
const clientMongo = new MongoClient(config.mongoDBDSN, {
    maxPoolSize: 30, // Configuración del tamaño máximo del pool
});

// Conectar al cliente de Mongo
clientMongo.connect().catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir si no se puede conectar
});

export const getDb = (dbName: string): Db => {
    return clientMongo.db(dbName); // Retorna dinámicamente la conexión a la base de datos especificada
};
