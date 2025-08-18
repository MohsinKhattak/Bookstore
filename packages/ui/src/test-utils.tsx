import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null } as any,
  reducers: {},
});

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    preloadedState,
    customStore,
    ...options
  }: {
    route?: string;
    preloadedState?: ReturnType<typeof rootReducer>;
    customStore?: any;
  } & RenderOptions = {}
) {
  const store =
    customStore ??
    configureStore({
      reducer: rootReducer,
      preloadedState,
    });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
    options
  );
}
