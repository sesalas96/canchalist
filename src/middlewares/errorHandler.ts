import { Request, Response } from 'express';
import { error } from 'express-openapi-validator';

const errorHandler = (err: Error, req: Request, res: Response) => {
    // Handling errors from express-openapi-validator
    if (err instanceof error.BadRequest && err.errors) {
        return res.status(err.status).json({ errors: err.errors.map((error) => error.message) });
    }

    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
