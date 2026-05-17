import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import axios from 'axios';
import { TrackingPage } from './TrackingPage';

vi.mock('axios');

const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const orderId = 'order-1';

const orderFixture = {
  id: orderId,
  orderTimeMs: Date.now() - 3 * 24 * 60 * 60 * 1000,
  totalCostCents: 5099,
  products: [{
    productId,
    quantity: 2,
    estimatedDeliveryTimeMs: Date.now() + 4 * 24 * 60 * 60 * 1000,
    product: {
      id: productId,
      image: '/images/products/athletic-cotton-socks-6-pairs.jpg',
      name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    },
  }],
};

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/tracking/:orderId/:productId"
          element={<TrackingPage cart={[]} />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('TrackingPage', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it('renders the product name, arrival date, and a progress bar', async () => {
    axios.get.mockResolvedValue({ data: orderFixture });
    renderAt(`/tracking/${orderId}/${productId}`);

    expect(
      await screen.findByText('Black and Gray Athletic Cotton Socks - 6 Pairs')
    ).toBeInTheDocument();

    expect(screen.getByTestId('tracking-arrival')).toBeInTheDocument();

    const bar = screen.getByTestId('progress-bar');
    const width = bar.style.width;
    const pct = parseInt(width, 10);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it('shows an error when the product is not in the order', async () => {
    axios.get.mockResolvedValue({ data: { ...orderFixture, products: [] } });
    renderAt(`/tracking/${orderId}/${productId}`);

    expect(await screen.findByTestId('tracking-error')).toHaveTextContent(/not found/i);
  });

  it('shows an error when the request fails', async () => {
    axios.get.mockRejectedValue(new Error('boom'));
    renderAt(`/tracking/${orderId}/${productId}`);

    expect(await screen.findByTestId('tracking-error')).toHaveTextContent(/Could not load/i);
  });
});
