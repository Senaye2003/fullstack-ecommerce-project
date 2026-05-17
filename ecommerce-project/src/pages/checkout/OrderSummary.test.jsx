import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { OrderSummary } from './OrderSummary';

vi.mock('axios');

const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

const cart = [{
  productId,
  quantity: 2,
  deliveryOptionId: '1',
  product: {
    id: productId,
    image: '/images/products/athletic-cotton-socks-6-pairs.jpg',
    name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    priceCents: 1090,
  },
}];

const deliveryOptions = [{
  id: '1',
  priceCents: 0,
  deliveryDays: 7,
  estimatedDeliveryTimeMs: Date.now() + 7 * 24 * 60 * 60 * 1000,
}];

describe('OrderSummary Update quantity', () => {
  let loadCart;

  beforeEach(() => {
    loadCart = vi.fn(async () => {});
    axios.put.mockReset();
    axios.put.mockResolvedValue({ data: { productId, quantity: 5 } });
  });

  it('clicking Update reveals a quantity input', async () => {
    render(<OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId(`update-quantity-${productId}`));

    const input = screen.getByTestId(`quantity-input-${productId}`);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(2);
  });

  it('Save sends a PUT to /api/cart-items/:productId and reloads the cart', async () => {
    render(<OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId(`update-quantity-${productId}`));
    const input = screen.getByTestId(`quantity-input-${productId}`);
    await user.clear(input);
    await user.type(input, '5');
    await user.click(screen.getByTestId(`save-quantity-${productId}`));

    expect(axios.put).toHaveBeenCalledWith(`/api/cart-items/${productId}`, { quantity: 5 });
    expect(loadCart).toHaveBeenCalled();
  });

  it('shows an error and does not call axios when quantity is out of range', async () => {
    render(<OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId(`update-quantity-${productId}`));
    const input = screen.getByTestId(`quantity-input-${productId}`);
    await user.clear(input);
    await user.type(input, '99');
    await user.click(screen.getByTestId(`save-quantity-${productId}`));

    expect(screen.getByText(/Quantity must be between 1 and 10/i)).toBeInTheDocument();
    expect(axios.put).not.toHaveBeenCalled();
  });
});
