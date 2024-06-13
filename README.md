# CCI Node API

An API built with Express.js and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Validation](#validation)

## Installation

1. Clone the repository:
   ```bash
   git clone https://galex.consolidated.com/ashley/cci-node-template.git
   cd cci-node-template
   ```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add the following environment variables:
```env
PORT=3000
API_BASE_URL=https://jsonplaceholder.typicode.com
```

4. Compile TypeScript:
```bash
npm run build
```

5. Run the application
```
npm start
```

## Scripts
`npm run build`: Compile the TypeScript code to JavaScript.
`npm start`: Run the compiled JavaScript code.
`npm run dev`: Run the application in development mode using `ts-node`

## API Documentation
The API documentation is generated using Swagger and can be accessed at http://localhost:3000/api-docs.

## Middleware
- Helmet: Secures the app by setting various HTTP headers.
- CORS: Enables Cross-Origin Resource Sharing.
- morgan: HTTP request logger.
- express-validator: Middleware for validating request bodies.

## Error Handling
A centralized error handling middleware is used to catch and respond to errors gracefully.

src/middlewares/errorHandler.ts:
```typescript
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
```

## Validation
Request Validation is implemented using `express-validator`.

src/routes/users.ts
```typescript
import { Router } from 'express';
import userController from '../controllers/userController';
import { body } from 'express-validator';

const router = Router();

router.get('/', userController.getAllUsers);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid')
  ],
  userController.createUser
);

export default router;
```