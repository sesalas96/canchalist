/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes';
import config from '@src/config';
import { ROUTES } from './constants';
import httpContext from 'express-http-context';
import { middleware } from 'express-openapi-validator';
import logger from './lib/logger';
import { specsObject, specsPath } from './docs';
import connectMongo from './services/db/mongo';
import '@src/services/cron/cronJobs';

const app = express();
const PORT = config.port;

// Middlewares
app.use(httpContext.middleware);

app.use(
    morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) },
    }),
);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));

// support encoded bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// app.use(
//     middleware({
//         apiSpec: specsPath,
//         validateRequests: false,
//         validateResponses: false,
//         validateApiSpec: false,
//     }),
// );
app.use(ROUTES.BASE, apiRouter);

app.use(ROUTES.API_DOCS, swaggerUi.serve, swaggerUi.setup(specsObject));

app.use(errorHandler);

// Función para inicializar la aplicación
const startServer = async () => {
    try {
        await connectMongo();
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        process.exit(1); // Salir del proceso si hay un error crítico
    }
};

// Llamar a la función de inicio
startServer();

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
