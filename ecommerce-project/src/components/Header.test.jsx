import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { Header } from './Header';

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="probe">{location.pathname}{location.search}</div>
  );
}

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Header cart={[{ quantity: 2 }, { quantity: 3 }]} />
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Header search', () => {
  it('shows the total cart quantity', () => {
    renderWithRouter();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('navigates to /?search=... when the user submits a query', async () => {
    renderWithRouter();
    const input = screen.getByTestId('header-search-input');
    const user = userEvent.setup();

    await user.type(input, 'socks');
    await user.click(screen.getByTestId('header-search-button'));

    expect(screen.getByTestId('probe').textContent).toBe('/?search=socks');
  });

  it('clears the search query when the user submits whitespace', async () => {
    renderWithRouter();
    const user = userEvent.setup();
    await user.type(screen.getByTestId('header-search-input'), '   ');
    await user.click(screen.getByTestId('header-search-button'));
    expect(screen.getByTestId('probe').textContent).toBe('/');
  });
});
