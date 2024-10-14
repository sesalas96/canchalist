import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { httpContext } from '@mule-migration/core';

const endpointFunction = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = httpContext.getTransactionId();
    // code here

    res.status(200).json('200 of example endpoint...');
};

export default endpointFunction;
