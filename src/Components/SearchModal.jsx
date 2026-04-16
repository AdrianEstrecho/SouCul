/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import fallbackImage from "../assets/no-image.jpg";

function resolveImg(raw) {
  const v = String(raw || "").trim();
  if (!v) return fallbackImage;
  if (/^https?:\/\//i.test(v) || v.startsWith("data:") || v.startsWith("blob:") || v.startsWith("/")) return v;
  return `/${v.replace(/^\/+/, "")}`;
}

export default function SearchDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen || loaded) return;
    let active = true;
    (async () => {
      try {
        const api = window.CustomerAPI;
        if (!api || typeof api.getProducts !== "function") throw 0;
        const res = await api.getProducts({ page: 1, per_page: 500 });
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (!active) return;
        setProducts(rows.map((r) => ({
          id: Number(r.id),
          name: r.name || "Product",
          location: r.location_name || "Philippines",
          price: Number(r.discount_price ?? r.price ?? 0),
          img: resolveImg(r.featured_image_url),
          category: r.category_name || "Product",
        })));
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, [isOpen, loaded]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const norm = query.trim().toLowerCase();
  const results = norm
    ? products.filter((p) =>
        [p.name, p.category, p.location].some((v) => String(v).toLowerCase().includes(norm))
      ).slice(0, 6)
    : [];

  const popular = products.slice(0, 4);

  const go = useCallback((p) => {
    onClose();
    navigate(`/Product/${p.id}`);
  }, [navigate, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/ProductPage?search=${encodeURIComponent(query.trim())}`);
  };

  if (!isOpen) return null;

  const ProductRow = ({ p }) => (
    <div className="srch-item" onClick={() => go(p)}>
      <div className="srch-item-img"><img src={p.img} alt={p.name} /></div>
      <div className="srch-item-info">
        <div className="srch-item-name">{p.name}</div>
        <div className="srch-item-detail">
          <span className="srch-item-loc">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {p.location}
          </span>
          <span className="srch-item-cat">{p.category}</span>
        </div>
      </div>
      <div className="srch-item-right">
        <div className="srch-item-price">{"\u20B1"}{p.price.toLocaleString()}</div>
        <svg className="srch-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="srch-dropdown" ref={panelRef}>
      {/* Header with input */}
      <form className="srch-input-row" onSubmit={handleSubmit}>
        <svg className="srch-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className="srch-input"
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button type="button" className="srch-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <kbd className="srch-kbd">ESC</kbd>
        )}
      </form>

      <div className="srch-divider" />

      {/* Body */}
      <div className="srch-body">
        {!norm ? (
          <>
            <div className="srch-section-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Popular Products</span>
            </div>
            {popular.map((p) => <ProductRow key={p.id} p={p} />)}
          </>
        ) : results.length > 0 ? (
          <>
            <div className="srch-section-head">
              <span>{results.length} result{results.length !== 1 ? "s" : ""} found</span>
            </div>
            {results.map((p) => <ProductRow key={p.id} p={p} />)}
          </>
        ) : (
          <div className="srch-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M8 11h6" />
            </svg>
            <div>No results for <strong>"{query.trim()}"</strong></div>
            <span>Try a different keyword</span>
          </div>
        )}
      </div>

      {/* Footer */}
      {norm && results.length > 0 && (
        <>
          <div className="srch-divider" />
          <div className="srch-footer" onClick={handleSubmit}>
            <span>View all results</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </>
      )}

      {!norm && (
        <>
          <div className="srch-divider" />
          <div className="srch-tip">
            <kbd className="srch-kbd">Enter</kbd> <span>to search all</span>
            <kbd className="srch-kbd" style={{ marginLeft: 8 }}>Ctrl K</kbd> <span>to open</span>
          </div>
        </>
      )}
    </div>
  );
}
