import express from 'express';
import apiRouter from '@src/routes';
import { ROUTES } from '@src/constants';
import { specsPath } from '@src/docs';
import { middleware } from 'express-openapi-validator';
import { errorHandler } from '@src/middlewares/errorHandler';

const testApp = express();

testApp.use(express.json());
testApp.use(
    middleware({
        apiSpec: specsPath,
        validateRequests: true,
        validateResponses: false,
    }),
);

testApp.use(ROUTES.BASE, apiRouter);
testApp.use(errorHandler);

export { testApp };
