import request from 'supertest';
import express from 'express';
import usersRouter from '@src/routes/users';
import { UsersService } from '@src/services';
import MockedData from '@src/__mocks__/services/users';

jest.mock('@src/services');
const mockedService = UsersService.fetchUsers as jest.MockedFunction<
  typeof UsersService.fetchUsers
>;

const app = express();
app.use(express.json());
app.use(usersRouter);

describe('Get Users Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks before each test
  });

  it('should return all users', async () => {
    mockedService.mockResolvedValue(MockedData.success);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
