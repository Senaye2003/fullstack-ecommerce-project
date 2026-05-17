import axios from 'axios';
import { useState, useRef } from 'react';
import { formatMoney } from '../../utils/money';

export function Product({ product, loadCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const addedTimerRef = useRef(null);

  const addToCart = async () => {
    await axios.post('/api/cart-items', {
      productId: product.id,
      quantity
    });
    await loadCart();
    setShowAdded(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setShowAdded(false), 2000);
  };

  const selectQuantity = (event) => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
  };

  return (
    <div className="product-container"
      data-testid="product-container">
      <div className="product-image-container">
        <img className="product-image"
          data-testid="product-image"
          src={product.image}
          alt={product.name} />
      </div>

      <div className="product-name limit-text-to-2-lines">
        {product.name}
      </div>

      <div className="product-rating-container">
        <img className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`${product.rating.stars} stars`} />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">
        {formatMoney(product.priceCents)}
      </div>

      <div className="product-quantity-container">
        <label htmlFor={`quantity-${product.id}`} className="sr-only">
          Quantity for {product.name}
        </label>
        <select
          id={`quantity-${product.id}`}
          name={`quantity-${product.id}`}
          value={quantity}
          onChange={selectQuantity}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="product-spacer"></div>

      {showAdded && (
        <div className="added-to-cart">
          <img src="/images/icons/checkmark.png" alt="Added" />
          Added
        </div>
      )}

      <button className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
}