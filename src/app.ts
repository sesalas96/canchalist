import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes';
import config from '@src/config';
import { ROUTES } from './constants';
import httpContext from 'express-http-context';
import { middleware } from 'express-openapi-validator';
import logger from './lib/logger';
import { specsObject, specsPath } from './docs';

const app = express();
const port = config.port;

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

app.use(
    middleware({
        apiSpec: specsPath,
        validateRequests: true,
        validateResponses: false,
        validateApiSpec: true,
    }),
);
app.use(ROUTES.BASE, apiRouter);

app.use(ROUTES.API_DOCS, swaggerUi.serve, swaggerUi.setup(specsObject));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
