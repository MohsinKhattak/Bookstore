import { authService } from './auth.service';

// Mock the module that authService imports
jest.mock('../api/axiosInstance', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Pull the mocked fns for assertions
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axiosInstance = require('../api/axiosInstance').default as {
  post: jest.Mock;
  get: jest.Mock;
};

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('POSTs /users/register with payload and returns data', async () => {
      const payload = { name: 'Alice', email: 'a@a.com', password: 'secret' };
      const data = { user: { id: 'u1', name: 'Alice', email: 'a@a.com' } };

      axiosInstance.post.mockResolvedValue({ data });

      const res = await authService.signup(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/users/register',
        payload
      );
      expect(res).toEqual(data);
    });

    it('throws on error', async () => {
      const err = new Error('boom');
      axiosInstance.post.mockRejectedValue(err);

      await expect(
        authService.signup({ name: 'A', email: 'a@a.com', password: 'x' })
      ).rejects.toThrow('boom');
    });
  });

  describe('login', () => {
    it('POSTs /users/login with payload and returns data', async () => {
      const payload = { email: 'a@a.com', password: 'secret' };
      const data = { token: 'jwt', user: { id: 'u1' } };

      axiosInstance.post.mockResolvedValue({ data });

      const res = await authService.login(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith('/users/login', payload);
      expect(res).toEqual(data);
    });

    it('throws on error', async () => {
      const err = new Error('invalid');
      axiosInstance.post.mockRejectedValue(err);

      await expect(
        authService.login({ email: 'a@a.com', password: 'bad' })
      ).rejects.toThrow('invalid');
    });
  });

  describe('logout', () => {
    it('GETs /users/logout and returns data', async () => {
      const data = { success: true };
      axiosInstance.get.mockResolvedValue({ data });

      const res = await authService.logout();

      expect(axiosInstance.get).toHaveBeenCalledWith('/users/logout');
      expect(res).toEqual(data);
    });

    it('throws on error', async () => {
      const err = new Error('nope');
      axiosInstance.get.mockRejectedValue(err);

      await expect(authService.logout()).rejects.toThrow('nope');
    });
  });

  describe('autenticateMe', () => {
    it('GETs /users/authenticate and returns data', async () => {
      const data = { authenticated: true, user: { id: 'u1' } };
      axiosInstance.get.mockResolvedValue({ data });

      const res = await authService.autenticateMe();

      expect(axiosInstance.get).toHaveBeenCalledWith('/users/authenticate');
      expect(res).toEqual(data);
    });

    it('throws on error', async () => {
      const err = new Error('auth failed');
      axiosInstance.get.mockRejectedValue(err);

      await expect(authService.autenticateMe()).rejects.toThrow('auth failed');
    });
  });
});
