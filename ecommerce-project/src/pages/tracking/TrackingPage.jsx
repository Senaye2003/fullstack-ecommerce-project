import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Header } from '../../components/Header';
import './TrackingPage.css';

function deliveryProgressPercent(orderTimeMs, estimatedDeliveryTimeMs) {
  const now = Date.now();
  if (!orderTimeMs || !estimatedDeliveryTimeMs) return 0;
  if (now >= estimatedDeliveryTimeMs) return 100;
  const total = estimatedDeliveryTimeMs - orderTimeMs;
  if (total <= 0) return 100;
  const elapsed = now - orderTimeMs;
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

function currentStatus(percent) {
  if (percent >= 100) return 'Delivered';
  if (percent >= 50) return 'Shipped';
  return 'Preparing';
}

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const [state, setState] = useState({ loading: true, order: null, product: null, error: '' });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}?expand=products`);
        const order = response.data;
        const product = (order.products || []).find((p) => p.product?.id === productId);
        if (!cancelled) {
          if (!product) {
            setState({ loading: false, order, product: null, error: 'Product not found in this order.' });
          } else {
            setState({ loading: false, order, product, error: '' });
          }
        }
      } catch (e) {
        if (!cancelled) {
          setState({ loading: false, order: null, product: null, error: 'Could not load this order.' });
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [orderId, productId]);

  const { loading, order, product, error } = state;
  const percent = product ? deliveryProgressPercent(order.orderTimeMs, product.estimatedDeliveryTimeMs) : 0;
  const status = currentStatus(percent);

  return (
    <>
      <title>Tracking · Senaye</title>
      <Header cart={cart} />

      <div className="tracking-page">
        <Link className="back-to-orders-link link-primary" to="/orders">
          &larr; View all orders
        </Link>

        {loading && <div className="tracking-loading">Loading tracking info…</div>}

        {!loading && error && (
          <div className="tracking-error" data-testid="tracking-error">{error}</div>
        )}

        {!loading && product && (
          <>
            <div className="delivery-date" data-testid="tracking-arrival">
              {percent >= 100 ? 'Delivered on ' : 'Arriving on '}
              {dayjs(product.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
            </div>

            <div className="product-info">{product.product.name}</div>
            <div className="product-info">Quantity: {product.quantity}</div>

            <img
              className="tracking-product-image"
              src={product.product.image}
              alt={product.product.name} />

            <div className="progress-labels-container">
              <div className={`progress-label ${status === 'Preparing' ? 'current-status' : ''}`}>Preparing</div>
              <div className={`progress-label ${status === 'Shipped' ? 'current-status' : ''}`}>Shipped</div>
              <div className={`progress-label ${status === 'Delivered' ? 'current-status' : ''}`}>Delivered</div>
            </div>

            <div className="progress-bar-container" aria-label="Delivery progress">
              <div
                className="progress-bar"
                data-testid="progress-bar"
                style={{ width: `${percent}%` }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
