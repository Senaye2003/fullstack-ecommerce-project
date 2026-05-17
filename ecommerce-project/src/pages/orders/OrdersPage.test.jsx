import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import axios from 'axios';
import { OrdersPage } from './OrdersPage';

vi.mock('axios');

const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const orderId = 'order-1';

const ordersFixture = [{
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
}];

describe('OrdersPage Buy again', () => {
  let loadCart;

  beforeEach(() => {
    loadCart = vi.fn(async () => {});
    axios.get.mockReset();
    axios.post.mockReset();
    axios.get.mockResolvedValue({ data: ordersFixture });
    axios.post.mockResolvedValue({ data: {} });
  });

  it('clicking Buy it again POSTs to /api/cart-items and reloads the cart', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} loadCart={loadCart} />
      </MemoryRouter>
    );

    const button = await screen.findByTestId(`buy-again-${productId}`);
    const user = userEvent.setup();
    await user.click(button);

    expect(axios.post).toHaveBeenCalledWith('/api/cart-items', { productId, quantity: 1 });
    expect(loadCart).toHaveBeenCalled();
  });
});
