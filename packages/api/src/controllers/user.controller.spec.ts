// __tests__/auth.controller.test.ts
import { register, login, logout, authenticateMe } from './user.controller';
import * as authService from '../services/auth.service';

jest.mock('../services/auth.service');

type MockReq = Partial<{
  body: any;
  params: any;
  query: any;
  user?: { id: string };
}>;
type MockRes = {
  status: jest.Mock;
  json: jest.Mock;
  cookie: jest.Mock;
};

function mockRes(): MockRes {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res as MockRes;
}

describe('auth.controller', () => {
  // Silence console during expected error tests
  let logSpy: jest.SpyInstance;
  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterAll(() => {
    logSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('400 when details are incomplete', async () => {
      const req: MockReq = { body: { name: 'A', email: '', password: '' } };
      const res = mockRes();

      await register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please Send Complete Details',
      });
    });

    it('409 when user already exists', async () => {
      const req: MockReq = {
        body: { name: 'A', email: 'a@b.com', password: 'x' },
      };
      const res = mockRes();

      (authService.userExistsByEmail as jest.Mock).mockResolvedValue({
        _id: 'u1',
      });

      await register(req as any, res as any);

      expect(authService.userExistsByEmail).toHaveBeenCalledWith('a@b.com');
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User With Same Email Already Exists',
      });
    });

    it('201 when user is created', async () => {
      const req: MockReq = {
        body: { name: 'A', email: 'a@b.com', password: 'x' },
      };
      const res = mockRes();

      (authService.userExistsByEmail as jest.Mock).mockResolvedValue(null);
      (authService.createUser as jest.Mock).mockResolvedValue({
        _id: 'u2',
        name: 'A',
        email: 'a@b.com',
      });

      await register(req as any, res as any);

      expect(authService.createUser).toHaveBeenCalledWith({
        name: 'A',
        email: 'a@b.com',
        password: 'x',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User Registered Successfully',
        user: { _id: 'u2', name: 'A', email: 'a@b.com' },
      });
    });

    it('500 on unexpected error', async () => {
      const req: MockReq = {
        body: { name: 'A', email: 'a@b.com', password: 'x' },
      };
      const res = mockRes();

      (authService.userExistsByEmail as jest.Mock).mockRejectedValue(
        new Error('DB down')
      );

      await register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('login', () => {
    it('400 when details are incomplete', async () => {
      const req: MockReq = { body: { email: '', password: '' } };
      const res = mockRes();

      await login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please Send Complete Details',
      });
    });

    it('400 when user not found', async () => {
      const req: MockReq = { body: { email: 'a@b.com', password: 'x' } };
      const res = mockRes();

      (authService.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });

    it('400 when password mismatch', async () => {
      const req: MockReq = { body: { email: 'a@b.com', password: 'x' } };
      const res = mockRes();

      (authService.findUserByEmail as jest.Mock).mockResolvedValue({
        _id: 'u1',
      });
      (authService.comparePassword as jest.Mock).mockResolvedValue(false);

      await login(req as any, res as any);

      expect(authService.comparePassword).toHaveBeenCalledWith(
        { _id: 'u1' },
        'x'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });

    it('201 when login succeeds and sets cookie', async () => {
      const req: MockReq = { body: { email: 'a@b.com', password: 'x' } };
      const res = mockRes();

      (authService.findUserByEmail as jest.Mock).mockResolvedValue({
        _id: 'u1',
        email: 'a@b.com',
        name: 'Alice',
      });
      (authService.comparePassword as jest.Mock).mockResolvedValue(true);
      (authService.makeJwt as jest.Mock).mockReturnValue('jwt.token.here');

      await login(req as any, res as any);

      expect(authService.makeJwt).toHaveBeenCalledWith('u1');
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'jwt.token.here',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged in Successfully',
        user: { _id: 'u1', email: 'a@b.com', name: 'Alice' },
      });
    });

    it('500 on unexpected error', async () => {
      const req: MockReq = { body: { email: 'a@b.com', password: 'x' } };
      const res = mockRes();

      (authService.findUserByEmail as jest.Mock).mockRejectedValue(
        new Error('DB down')
      );

      await login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('logout', () => {
    it('clears token cookie and returns 200', () => {
      const req: MockReq = {};
      const res = mockRes();

      const result = logout(req as any, res as any);

      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        '',
        expect.objectContaining({
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: expect.any(String),
          expires: expect.any(Date),
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });

      expect(result).toBe(res);
    });
  });

  describe('authenticateMe', () => {
    it('401 when no user on request', async () => {
      const req: MockReq = {}; // no user
      const res = mockRes();

      await authenticateMe(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not authenticated',
      });
    });

    it('404 when user not found', async () => {
      const req: MockReq = { user: { id: 'u-missing' } };
      const res = mockRes();

      (authService.findUserById as jest.Mock).mockResolvedValue(null);

      await authenticateMe(req as any, res as any);

      expect(authService.findUserById).toHaveBeenCalledWith('u-missing');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No Such User Found' });
    });

    it('200 when user found', async () => {
      const req: MockReq = { user: { id: 'u1' } };
      const res = mockRes();

      (authService.findUserById as jest.Mock).mockResolvedValue({
        _id: 'u1',
        name: 'Alice',
        email: 'a@b.com',
      });

      await authenticateMe(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Success',
        user: { _id: 'u1', name: 'Alice', email: 'a@b.com' },
      });
    });

    it('500 on unexpected error', async () => {
      const req: MockReq = { user: { id: 'u1' } };
      const res = mockRes();

      (authService.findUserById as jest.Mock).mockRejectedValue(
        new Error('DB down')
      );

      await authenticateMe(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });
});
