import 'module-alias/register';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import logger from '@src/logger';
import apiRouter from './routes';

const app = express();
const port = Number(process.env.PORT) || 3000;

// Middleware
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', apiRouter);

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
