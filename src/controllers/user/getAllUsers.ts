import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@src/services';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UsersService.fetchUsers();
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name.toUpperCase(),
      email: user.email,
      city: user.address.city,
      company: user.company.name,
    }));
    res.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error); // Ensure errors are passed to the error handling middleware
  }
};

export default getAllUsers;
