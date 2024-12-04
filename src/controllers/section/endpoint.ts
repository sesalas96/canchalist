import { Request, Response, NextFunction } from 'express';

const endpointFunction = async (req: Request, res: Response, next: NextFunction) => {
    // code here
    console.log('sebas');
    res.status(200).json('200 of example endpoint...');
};

export default endpointFunction;
