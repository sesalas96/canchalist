import 'module-alias/register';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes';
import config from '@src/config';
import { ROUTES } from './constants';
import httpContext from 'express-http-context';
import { transactionIdSetter, logger } from '@mule-migration/core';
import { middleware } from 'express-openapi-validator';
import { specsObject, specsPath } from '@src/docs';

const app = express();
const port = config.port;

// Middlewares
app.use(httpContext.middleware);
app.use(transactionIdSetter);

app.use(
    morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) },
    }),
);
app.use(helmet());
app.use(cors());
app.use(express.json());

// Validations
app.use(
    middleware({
        apiSpec: specsPath,
        validateRequests: true, // (default)
        validateResponses: false, // Change to true if you want to validate responses,
        validateApiSpec: true,
    }),
);

// Routers
app.use(ROUTES.BASE, apiRouter);

// Documentation
app.use(ROUTES.API_DOCS, swaggerUi.serve, swaggerUi.setup(specsObject));

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
