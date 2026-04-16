/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useNavigate } from "react-router-dom";

const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function Products({ products }) {
  const navigate = useNavigate();

  const goToProduct = (product) => {
    navigate(`/Product/${product.id}`);
  };

  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <div key={`${product.id}-${i}`} className="product-card">
          <div className="product-img-wrapper" onClick={() => goToProduct(product)} style={{ cursor: "pointer" }}>
            <img src={product.image} alt={product.name} className="product-img" />
          </div>
          <div className="product-info">
            <div className="product-name">{product.name}</div>
            <div className="product-location">{product.location}</div>
          </div>
          <div className="product-actions">
            <button className="product-price-btn" onClick={() => goToProduct(product)}>
              ₱{product.price.toLocaleString()}
            </button>
            <button className="product-cart-btn" onClick={() => goToProduct(product)}>
              <CartIcon size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
