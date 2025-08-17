import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useLogin';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from 'store/features/user/UserSlice';
import { authService } from 'services/auth.service';

// --- Mocks ---
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();
const mockNavigate = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => mockUseSelector(selector),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    // NOTE: variable name starts with "mock" so Jest allows referencing it here
    useNavigate: () => mockNavigate,
  };
});

jest.mock('react-toastify', () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}));

jest.mock('services/auth.service', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // By default, selector returns base user slice shape
    mockUseSelector.mockImplementation((selector: any) =>
      selector({
        user: { isLoading: false, error: null, currentUser: null },
      })
    );
  });

  it('dispatches start + success, shows toast, and navigates on successful login', async () => {
    const user = { id: 'u1', name: 'Alice', email: 'a@a.com' };
    (authService.login as jest.Mock).mockResolvedValue({ user });

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login('a@a.com', 'secret');
    });

    // dispatch calls
    expect(mockDispatch).toHaveBeenCalledWith(loginStart());
    expect(mockDispatch).toHaveBeenCalledWith(loginSuccess(user));

    // toast + navigate
    expect(mockToastSuccess).toHaveBeenCalledWith('Logged In Successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/');
    // no error toast
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('dispatches start + failure and shows error toast on failed login (with server message)', async () => {
    const err = {
      response: { data: { message: 'Invalid credentials' } },
    };
    (authService.login as jest.Mock).mockRejectedValue(err);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login('a@a.com', 'bad');
    });

    expect(mockDispatch).toHaveBeenCalledWith(loginStart());
    expect(mockDispatch).toHaveBeenCalledWith(
      loginFailure('Invalid credentials')
    );

    expect(mockToastError).toHaveBeenCalledWith('Invalid credentials');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('falls back to generic error message when server has no message', async () => {
    (authService.login as jest.Mock).mockRejectedValue({}); // no response.data.message

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login('x@y.com', 'pw');
    });

    expect(mockDispatch).toHaveBeenCalledWith(loginStart());
    expect(mockDispatch).toHaveBeenCalledWith(loginFailure('Login failed'));
    expect(mockToastError).toHaveBeenCalledWith('Login failed');
  });

  it('exposes isLoading and error from the selector', () => {
    mockUseSelector.mockImplementation((selector: any) =>
      selector({
        user: { isLoading: true, error: 'oops', currentUser: null },
      })
    );

    const { result } = renderHook(() => useLogin());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe('oops');
  });
});
