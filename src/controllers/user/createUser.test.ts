import request from 'supertest';
import { testApp as app } from '@src/tests';

const route = '/users';

describe('Create User Controller', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Reset mocks before each test
    });

    it('Success', async () => {
        const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
        const response = await request(app).post(route).send(newUser);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Create a new user');
    });

    it('Error: invalid email', async () => {
        const newUser = { name: 'Tester', email: 'invalid-email' };
        const response = await request(app).post(route).send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Error: missing email', async () => {
        const newUser = { name: 'Tester' };
        const response = await request(app).post(route).send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Error: missing name', async () => {
        const newUser = { email: 'john.doe@example.com' };
        const response = await request(app).post(route).send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});
