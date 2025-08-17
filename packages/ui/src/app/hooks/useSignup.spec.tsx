import React, { FC } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSignup } from './useSignup';

// ---- Mocks ----
const mockNavigate = jest.fn(); // NOTE: prefixed with "mock" so Jest allows it
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSuccess = jest.fn();
const mockInfo = jest.fn();
const mockError = jest.fn();
jest.mock('react-toastify', () => ({
  toast: {
    success: (...args: any[]) => mockSuccess(...args),
    info: (...args: any[]) => mockInfo(...args),
    error: (...args: any[]) => mockError(...args),
  },
}));

jest.mock('services/auth.service', () => ({
  authService: {
    signup: jest.fn(),
  },
}));
import { authService } from 'services/auth.service';

// ---- Test harness using the hook ----
const HookHarness: FC = () => {
  const { signup } = useSignup();
  return (
    <button
      onClick={() => signup('Alice', 'a@a.com', 'secret')}
      aria-label="signup"
    >
      do-signup
    </button>
  );
};

function renderHookWithRouter(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <HookHarness />
    </MemoryRouter>
  );
}

// ---- Tests ----
describe('useSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls signup, shows success toast, and navigates to /login on success', async () => {
    (authService.signup as jest.Mock).mockResolvedValue({ ok: true });

    renderHookWithRouter();

    fireEvent.click(screen.getByLabelText('signup'));

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'a@a.com',
        password: 'secret',
      });
      expect(mockSuccess).toHaveBeenCalledWith('User Registered Successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows info toast when API returns 409 (already exists)', async () => {
    const conflictError = {
      response: { status: 409 },
    };
    (authService.signup as jest.Mock).mockRejectedValue(conflictError);

    renderHookWithRouter();
    fireEvent.click(screen.getByLabelText('signup'));

    await waitFor(() => {
      expect(mockInfo).toHaveBeenCalledWith(
        'User With Such Email Already Exists'
      );
      expect(mockError).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('shows generic error toast for non-409 errors', async () => {
    (authService.signup as jest.Mock).mockRejectedValue(new Error('boom'));

    renderHookWithRouter();
    fireEvent.click(screen.getByLabelText('signup'));

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('Signup failed. Try again.');
      expect(mockInfo).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
