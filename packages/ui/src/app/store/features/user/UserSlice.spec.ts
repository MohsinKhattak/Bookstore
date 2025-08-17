import reducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from './UserSlice';

describe('user slice (reducer-only)', () => {
  const initial = { currentUser: null, isLoading: false, error: '' };

  it('returns initial state by default', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initial);
  });

  it('loginStart -> sets isLoading true (does not clear error by design)', () => {
    const startWithError = { ...initial, error: 'old-error' };
    const next = reducer(startWithError as any, loginStart());
    expect(next.isLoading).toBe(true);
    expect(next.currentUser).toBeNull();
    // Your reducer does NOT clear error on loginStart — document & assert that:
    expect(next.error).toBe('old-error');
  });

  it('loginSuccess -> stops loading, stores user, clears error (to null)', () => {
    const loading = { ...initial, isLoading: true, error: 'old' };
    const user = { id: 'u1', name: 'Alice', email: 'a@a.com' } as any;

    const next = reducer(loading as any, loginSuccess(user));

    expect(next.isLoading).toBe(false);
    expect(next.currentUser).toEqual(user);
    expect(next.error).toBeNull(); // your reducer sets null (not empty string)
  });

  it('loginFailure -> stops loading, sets error, keeps currentUser', () => {
    const state = { ...initial, isLoading: true, currentUser: null };
    const errMsg = 'invalid credentials';
    const next = reducer(state as any, loginFailure(errMsg));

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe(errMsg);
    expect(next.currentUser).toBeNull();
  });

  it('logout -> clears currentUser (leaves error as-is)', () => {
    const state = {
      currentUser: { id: 'u1', name: 'Alice' } as any,
      isLoading: false,
      error: null as any,
    };
    const next = reducer(state as any, logout());
    expect(next.currentUser).toBeNull();
    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull(); // unchanged
  });
});
