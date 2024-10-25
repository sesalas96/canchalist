import { Request, Response, NextFunction } from 'express';

const createUser = (req: Request, res: Response, next: NextFunction) => {
    res.send('Create a new user');
};

export default createUser;
