import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null } as any,
  reducers: {},
});

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    preloadedState = {} as any,
    // If you have a real root reducer, you can pass a customStore in here instead
    customStore,
    ...options
  }: {
    route?: string;
    preloadedState?: any;
    customStore?: any;
  } & RenderOptions = {}
) {
  const store =
    customStore ??
    configureStore({
      reducer: {
        user: userSlice.reducer,
        // add more keys if your components read other slices:
        // cart: cartSlice.reducer, theme: themeSlice.reducer, ...
      },
      preloadedState,
    });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
    options
  );
}
