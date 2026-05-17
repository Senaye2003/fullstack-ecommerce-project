import { Link, useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import './Header.css';

export function Header({ cart }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  // Keep the input in sync if the user navigates between pages.
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/?search=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link" aria-label="Senaye home">
          <Logo variant="desktop" />
          <Logo variant="mobile" />
        </Link>
      </div>

      <form className="middle-section" onSubmit={onSubmit} role="search">
        <input
          className="search-bar"
          type="text"
          id="header-search"
          name="search"
          placeholder="Search"
          aria-label="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="header-search-input"
        />

        <button
          type="submit"
          className="search-button"
          aria-label="Submit search"
          data-testid="header-search-button">
          <img className="search-icon" src="/images/icons/search-icon.png" alt="" />
        </button>
      </form>

      <div className="right-section">
        <Link className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </Link>

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src="/images/icons/cart-icon.png" alt="Cart" />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
    </div>
  );
}
