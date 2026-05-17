import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { formatMoney } from '../../utils/money';
import { DeliveryOptions } from './DeliveryOptions';

function CartItemRow({ cartItem, deliveryOptions, loadCart }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuantity, setDraftQuantity] = useState(cartItem.quantity);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedDeliveryOption = deliveryOptions.find(
    (option) => option.id === cartItem.deliveryOptionId
  );

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  const startEditing = () => {
    setDraftQuantity(cartItem.quantity);
    setError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError('');
  };

  const saveQuantity = async () => {
    const next = Number(draftQuantity);
    if (!Number.isInteger(next) || next < 1 || next > 10) {
      setError('Quantity must be between 1 and 10');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await axios.put(`/api/cart-items/${cartItem.productId}`, { quantity: next });
      await loadCart();
      setIsEditing(false);
    } catch (e) {
      setError('Could not update quantity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cart-item-container">
      <div className="delivery-date">
        Delivery date: {selectedDeliveryOption
          ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')
          : '—'}
      </div>

      <div className="cart-item-details-grid">
        <img className="product-image"
          src={cartItem.product.image}
          alt={cartItem.product.name} />

        <div className="cart-item-details">
          <div className="product-name">
            {cartItem.product.name}
          </div>
          <div className="product-price">
            {formatMoney(cartItem.product.priceCents)}
          </div>
          <div className="product-quantity">
            {isEditing ? (
              <>
                <label
                  htmlFor={`cart-quantity-${cartItem.productId}`}
                  className="sr-only">
                  New quantity for {cartItem.product.name}
                </label>
                <span>Quantity: </span>
                <input
                  type="number"
                  id={`cart-quantity-${cartItem.productId}`}
                  name={`cart-quantity-${cartItem.productId}`}
                  min="1"
                  max="10"
                  value={draftQuantity}
                  onChange={(e) => setDraftQuantity(e.target.value)}
                  className="quantity-input"
                  data-testid={`quantity-input-${cartItem.productId}`}
                  disabled={saving}
                />
                <span
                  className="save-quantity-link link-primary"
                  data-testid={`save-quantity-${cartItem.productId}`}
                  onClick={saving ? undefined : saveQuantity}>
                  {saving ? 'Saving…' : 'Save'}
                </span>
                <span
                  className="cancel-quantity-link link-primary"
                  onClick={cancelEditing}>
                  Cancel
                </span>
              </>
            ) : (
              <>
                <span>
                  Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                </span>
                <span
                  className="update-quantity-link link-primary"
                  data-testid={`update-quantity-${cartItem.productId}`}
                  onClick={startEditing}>
                  Update
                </span>
                <span
                  className="delete-quantity-link link-primary"
                  onClick={deleteCartItem}>
                  Delete
                </span>
              </>
            )}
            {error && <div className="quantity-error">{error}</div>}
          </div>
        </div>

        <DeliveryOptions
          cartItem={cartItem}
          deliveryOptions={deliveryOptions}
          loadCart={loadCart}/>
      </div>
    </div>
  );
}

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 && cart.map((cartItem) => (
        <CartItemRow
          key={cartItem.productId}
          cartItem={cartItem}
          deliveryOptions={deliveryOptions}
          loadCart={loadCart}
        />
      ))}
    </div>
  );
}
