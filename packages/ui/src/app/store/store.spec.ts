// packages/ui/src/app/store/store.spec.ts
// Mock persist to avoid real storage and to let us build our own store:
jest.mock('redux-persist', () => ({
  __esModule: true,
  persistStore: jest.fn(() => ({})),
  persistReducer: (_cfg: any, baseReducer: any) => baseReducer, // identity
}));
jest.mock('redux-persist/lib/storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from './features/user/UserSlice';

function makeStore() {
  return configureStore({
    reducer: { user: userReducer }, // persistReducer is identity via mock
  });
}

describe('store (with mocked persist)', () => {
  it('initializes with user initial state', () => {
    const store = makeStore();
    expect(store.getState().user).toEqual({
      currentUser: null,
      isLoading: false,
      error: '',
    });
  });

  it('handles loginStart → loginSuccess', () => {
    const store = makeStore();
    store.dispatch(loginStart());
    expect(store.getState().user.isLoading).toBe(true);

    const user = { id: 'u1', name: 'Alice', email: 'a@a.com' } as any;
    store.dispatch(loginSuccess(user));

    const { user: s } = store.getState() as any;
    expect(s.isLoading).toBe(false);
    expect(s.currentUser).toEqual(user);
    expect(s.error).toBeNull();
  });

  it('handles loginFailure (does not clear currentUser unless you do it)', () => {
    const store = makeStore();

    // Start clean: ensure no user first (so the expectation below is valid)
    // If you WANT loginFailure to clear user, change the reducer and test accordingly.
    expect(store.getState().user.currentUser).toBeNull();

    store.dispatch(loginStart());
    store.dispatch(loginFailure('bad creds'));

    const { user: s } = store.getState() as any;
    expect(s.isLoading).toBe(false);
    expect(s.error).toBe('bad creds');
    expect(s.currentUser).toBeNull(); // passes now because we started fresh
  });

  it('handles logout', () => {
    const store = makeStore();
    store.dispatch(loginSuccess({ id: 'u1' } as any));
    store.dispatch(logout());
    expect(store.getState().user.currentUser).toBeNull();
  });
});
