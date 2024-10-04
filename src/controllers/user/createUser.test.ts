import request from 'supertest';
import express from 'express';
import usersRouter from '@src/routes/users';

const app = express();
app.use(express.json());
app.use(usersRouter);

describe('Create User Controller', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Reset mocks before each test
    });

    it('Success', async () => {
        const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Create a new user');
    });

    it('Error: invalid email', async () => {
        const newUser = { name: 'Tester', email: 'invalid-email' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Error: missing email', async () => {
        const newUser = { name: 'Tester' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Error: missing name', async () => {
        const newUser = { email: 'john.doe@example.com' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});
