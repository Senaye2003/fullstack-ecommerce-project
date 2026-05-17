import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => {
    let cancelled = false;
    const getHomeData = async () => {
      setLoading(true);
      try {
        const url = search
          ? `/api/products?search=${encodeURIComponent(search)}`
          : '/api/products';
        const response = await axios.get(url);
        if (!cancelled) setProducts(response.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getHomeData();
    return () => { cancelled = true; };
  }, [search]);

  return (
    <>
      <title>Senaye</title>

      <Header cart={cart} />

      <div className="home-page">
        {search && (
          <div className="search-results-header" data-testid="search-results-header">
            Results for “{search}”
          </div>
        )}

        {loading ? (
          <div className="products-loading">Loading…</div>
        ) : products.length === 0 ? (
          <div className="no-results" data-testid="no-results">
            No products found{search ? ` for “${search}”.` : '.'}
          </div>
        ) : (
          <ProductsGrid products={products} loadCart={loadCart}/>
        )}
      </div>
    </>
  );
}
