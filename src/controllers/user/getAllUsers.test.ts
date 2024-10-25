import request from 'supertest';
import { UsersService } from '@src/services';
import MockedData from '@src/__mocks__/services/users';
import { testApp as app } from '@src/tests';

jest.mock('@src/services');
const mockedService = UsersService.fetchUsers as jest.MockedFunction<
    typeof UsersService.fetchUsers
>;

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
