import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should show the Home heading on /', () => {
    renderWithProviders(<App />, { route: '/' });
    // Prefer accessible queries:
    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
    // or, if you prefer the brand text:
    // expect(screen.getByText(/bookstore/i)).toBeInTheDocument();
  });
});
