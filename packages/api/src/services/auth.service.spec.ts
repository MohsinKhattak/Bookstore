// __tests__/auth.service.test.ts (or ./auth.service.test.ts)
import User from '../models/user.model';
import {
  userExistsByEmail,
  createUser,
  findUserByEmail,
  comparePassword,
  makeJwt,
  findUserById,
} from './auth.service';
import { generateToken } from '../utility/jwt.util';

// Mock the User model (constructor + static methods) and jwt util
jest.mock('../models/user.model', () => {
  const mockCtor = jest.fn();
  // attach static methods we’ll use in tests
  (mockCtor as any).findOne = jest.fn();
  (mockCtor as any).findById = jest.fn();
  return {
    __esModule: true,
    default: mockCtor,
  };
});

jest.mock('../utility/jwt.util', () => ({
  generateToken: jest.fn(),
}));

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('userExistsByEmail', () => {
    it('calls User.findOne with email', async () => {
      (User as any).findOne.mockResolvedValue({ _id: 'u1' });

      const result = await userExistsByEmail('a@b.com');

      expect((User as any).findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
      expect(result).toEqual({ _id: 'u1' });
    });
  });

  describe('createUser', () => {
    it('constructs and saves a new user and returns it', async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      // When `new User(params)` is called, return an object with `save`
      (User as unknown as jest.Mock).mockImplementation((params) => ({
        ...params,
        _id: 'newId',
        save,
      }));

      const user = await createUser({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
      });

      // constructor called with params
      expect(User).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
      });
      // save called
      expect(save).toHaveBeenCalled();
      // returns the constructed user
      expect(user).toMatchObject({
        _id: 'newId',
        name: 'Alice',
        email: 'alice@example.com',
      });
    });
  });

  describe('findUserByEmail', () => {
    it('calls User.findOne with email', async () => {
      (User as any).findOne.mockResolvedValue({ _id: 'u2', email: 'x@y.com' });

      const user = await findUserByEmail('x@y.com');

      expect((User as any).findOne).toHaveBeenCalledWith({ email: 'x@y.com' });
      expect(user).toEqual({ _id: 'u2', email: 'x@y.com' });
    });
  });

  describe('comparePassword', () => {
    it('delegates to user.comparePassword', async () => {
      const user = { comparePassword: jest.fn().mockResolvedValue(true) };

      const ok = await comparePassword(user as any, 'pw');

      expect(user.comparePassword).toHaveBeenCalledWith('pw');
      expect(ok).toBe(true);
    });
  });

  describe('makeJwt', () => {
    it('calls generateToken and returns it', () => {
      (generateToken as jest.Mock).mockReturnValue('mock.jwt');

      const token = makeJwt('user-id-123');

      expect(generateToken).toHaveBeenCalledWith('user-id-123');
      expect(token).toBe('mock.jwt');
    });
  });

  describe('findUserById', () => {
    it('calls User.findById with id', async () => {
      (User as any).findById.mockResolvedValue({ _id: 'id123', name: 'A' });

      const user = await findUserById('id123');

      expect((User as any).findById).toHaveBeenCalledWith('id123');
      expect(user).toEqual({ _id: 'id123', name: 'A' });
    });
  });
});
