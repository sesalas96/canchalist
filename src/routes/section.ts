import { Router } from 'express';
import { ROUTES } from '@src/constants';
import SectionControllers from '@src/controllers/section';
import { query } from 'express-validator';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         city:
 *           type: string
 *           description: The city of the user
 *         company:
 *           type: string
 *           description: The company of the user
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john.doe@example.com
 *         city: New York
 *         company: Acme Corp
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
    ROUTES.SECTION.ENDPOINT_FUNCTION,
    [query('name').notEmpty().withMessage('Name is required')],
    SectionControllers.endpointFunction,
);

export default router;
