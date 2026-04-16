/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { getCookie } from "./utils/cookieState";
import { isInLocalWishlist, addToLocalWishlist, removeFromLocalWishlist } from "./utils/localWishlist";
import fallbackImage from "./assets/no-image.jpg";

function resolveImageUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return fallbackImage;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) return value;
  if (value.startsWith("/")) return value;
  return `/${value.replace(/^\/+/, "")}`;
}

export default function ProductDetail({ cartCount, onAddToCart, onDirectCheckout, isGuest }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState(null); // { type: "cart"|"wishlist"|"review", message }
  const toastTimer = useRef(null);

  const showToast = (type, message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // Load reviews (API + localStorage)
  useEffect(() => {
    let active = true;
    const localKey = `soucul_reviews_${id}`;

    const load = async () => {
      // Read local reviews first
      let local = [];
      try { local = JSON.parse(localStorage.getItem(localKey) || "[]"); } catch {}

      // Try API
      try {
        const api = window.CustomerAPI;
        if (!api || typeof api.getProductReviews !== "function") throw 0;
        const res = await api.getProductReviews(id);
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (active) setReviews([...local, ...rows]);
      } catch {
        if (active) setReviews(local);
      }
    };

    load();
    return () => { active = false; };
  }, [id]);

  // Load product details
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setAdded(false);
    setQty(1);

    const load = async () => {
      try {
        const api = window.CustomerAPI;
        if (!api || typeof api.getProduct !== "function") throw new Error("API unavailable");

        const res = await api.getProduct(id);
        const d = res?.data;
        if (!d) throw new Error("Product not found");

        if (!active) return;

        const ratingRaw = Number(d.rating_average ?? 0);
        const rating = Number.isFinite(ratingRaw) ? Math.max(0, Math.min(5, ratingRaw)) : 0;

        setProduct({
          id: Number(d.id),
          name: d.name || "Product",
          description: d.description || "A beautifully crafted item from the rich cultural heritage of the Philippines, made with traditional techniques passed down through generations.",
          price: Number(d.discount_price ?? d.price ?? 0),
          originalPrice: d.discount_price ? Number(d.price ?? 0) : null,
          image: resolveImageUrl(d.featured_image_url),
          location: d.location || d.location_name || "Philippines",
          category: d.category || d.category_name || "Product",
          stock: Math.max(0, Number(d.quantity_in_stock ?? 0)),
          rating,
          reviewCount: Number(d.review_count ?? 0),
          seller: d.seller_name || "Local Artisan Seller",
          material: d.material || "Locally sourced",
          deliveryTime: d.delivery_time || "3-5 business days",
        });
      } catch (err) {
        if (active) setError(err.message || "Failed to load product.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    let active = true;

    // Check local first
    if (isInLocalWishlist(id)) {
      setIsFavorited(true);
    }

    const check = async () => {
      try {
        const api = window.CustomerAPI;
        if (!api || typeof api.getWishlist !== "function") return;
        const res = await api.getWishlist();
        const items = Array.isArray(res?.data) ? res.data : [];
        if (active) setIsFavorited(items.some((w) => Number(w.product_id) === Number(id)));
      } catch {
        // API unavailable — local state already set above
      }
    };

    check();
    return () => { active = false; };
  }, [id]);

  // Clamp qty to stock
  useEffect(() => {
    if (!product) return;
    setQty((prev) => {
      if (product.stock <= 0) return 0;
      return Math.min(Math.max(1, prev), product.stock);
    });
  }, [product]);

  const isLoggedIn = getCookie("soucul_loggedIn") === "true" || !!getCookie("customer_token");
  const isGuestUser = getCookie("soucul_currentUser") === "guest";
  const requiresLogin = !isLoggedIn || isGuestUser;

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || qty < 1) return;
    if (requiresLogin) { setShowLoginPrompt(true); return; }
    const result = await Promise.resolve(onAddToCart?.({ ...product, image: product.image, qty }));
    if (result === false) return;
    setAdded(true);
    showToast("cart", `${product.name} added to cart`);
  };

  const handleCheckout = async () => {
    if (!product || product.stock <= 0 || qty < 1) return;
    if (requiresLogin) { setShowLoginPrompt(true); return; }
    const result = await Promise.resolve(onDirectCheckout?.({ ...product, image: product.image, qty }));
    if (result === false) return;
    navigate("/Checkout");
  };

  const handleFavorite = async () => {
    if (favLoading) return;
    if (requiresLogin) { setShowLoginPrompt(true); return; }
    setFavLoading(true);
    const newState = !isFavorited;
    setIsFavorited(newState);

    // Persist to localStorage
    if (newState) {
      addToLocalWishlist(product);
    } else {
      removeFromLocalWishlist(id);
    }

    showToast("wishlist", newState ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`);
    try {
      const api = window.CustomerAPI;
      if (!api) return;
      if (newState) {
        await api.addToWishlist(id);
      } else {
        await api.removeFromWishlist(id);
      }
    } catch {
      // API unavailable — localStorage already updated
    } finally {
      setFavLoading(false);
    }
  };

  const handleWriteReview = () => {
    if (requiresLogin) { setShowLoginPrompt(true); return; }
    setReviewRating(0);
    setReviewHover(0);
    setReviewComment("");
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !reviewComment.trim()) return;
    setReviewSubmitting(true);

    const userCookie = getCookie("soucul_currentUser") || "";
    const newReview = {
      id: Date.now(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      first_name: userCookie.split("@")[0] || "You",
      last_name: "",
      created_at: new Date().toISOString(),
    };

    // Save locally
    const localKey = `soucul_reviews_${id}`;
    let local = [];
    try { local = JSON.parse(localStorage.getItem(localKey) || "[]"); } catch {}
    local.unshift(newReview);
    localStorage.setItem(localKey, JSON.stringify(local));

    // Try API too
    try {
      const api = window.CustomerAPI;
      if (api && typeof api.createReview === "function") {
        await api.createReview({ product_id: id, rating: reviewRating, comment: reviewComment.trim() });
      }
    } catch {}

    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
    setReviewSubmitting(false);
    showToast("review", "Your review has been submitted!");
  };

  if (loading) {
    return (
      <>
        <Navbar cartCount={cartCount} solidBackground />
        <div className="pd-loading">Loading product...</div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar cartCount={cartCount} solidBackground />
        <div className="pd-error">
          <h2>Product not found</h2>
          <p>{error || "This product may have been removed."}</p>
          <button className="pd-back-btn" onClick={() => navigate("/ProductPage")}>Browse Products</button>
        </div>
      </>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const totalPrice = product.price * Math.max(0, qty);
  const tags = [product.category, product.location, "Authentic"].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .pd-loading, .pd-error {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          color: #555;
          padding: 32px;
          text-align: center;
          padding-top: 100px;
        }
        .pd-error h2 { font-size: 24px; color: #333; margin-bottom: 8px; }
        .pd-error p { color: #777; margin-bottom: 24px; }
        .pd-back-btn {
          background: #0091A9; color: #fff; border: none; padding: 12px 32px;
          border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: background 0.2s;
        }
        .pd-back-btn:hover { background: #007a8f; }

        /* ── Page Layout ── */
        .pd-page {
          font-family: 'Inter', sans-serif;
          background: #f5f7fa;
          min-height: 100vh;
          padding-top: 80px;
        }

        /* ── Breadcrumb ── */
        .pd-breadcrumb {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px 0;
          font-size: 13px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .pd-breadcrumb a {
          color: #0091A9;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .pd-breadcrumb a:hover { color: #006070; }
        .pd-breadcrumb span { color: #bbb; }

        /* ── Product Section ── */
        .pd-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        /* ── Image Side ── */
        .pd-image-section {
          position: sticky;
          top: 100px;
        }
        .pd-image-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        }
        .pd-image-wrapper {
          width: 100%;
          aspect-ratio: 1;
          background: #e8f4f7;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pd-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .pd-image-wrapper:hover img { transform: scale(1.05); }

        .pd-tags {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          flex-wrap: wrap;
        }
        .pd-tag {
          background: #e8f4f7;
          color: #0091A9;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }

        /* ── Details Side ── */
        .pd-details {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pd-location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #0091A9;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .pd-product-name {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .pd-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pd-stars { display: flex; gap: 2px; color: #f59e0b; }
        .pd-stars .star-empty { color: #d1d5db; }
        .pd-rating-score { font-weight: 700; font-size: 15px; color: #333; }
        .pd-review-count { font-size: 14px; color: #888; }

        .pd-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 24px;
        }
        .pd-price {
          font-size: 36px;
          font-weight: 800;
          color: #0091A9;
        }
        .pd-original-price {
          font-size: 20px;
          color: #aaa;
          text-decoration: line-through;
        }

        .pd-description {
          font-size: 15px;
          line-height: 1.7;
          color: #555;
          margin-bottom: 28px;
        }

        /* ── Info Grid ── */
        .pd-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .pd-info-item {
          background: #fff;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pd-info-label {
          font-size: 12px;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pd-info-value {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .pd-delivery {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f0fdf4;
          padding: 14px 18px;
          border-radius: 12px;
          color: #15803d;
          font-size: 14px;
          margin-bottom: 28px;
        }

        /* ── Quantity ── */
        .pd-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .pd-qty-label {
          font-size: 14px;
          font-weight: 600;
          color: #444;
        }
        .pd-qty-controls {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f3f4f6;
          border-radius: 10px;
          overflow: hidden;
        }
        .pd-qty-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          font-size: 18px;
          font-weight: 700;
          color: #333;
          cursor: pointer;
          transition: background 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .pd-qty-btn:hover:not(:disabled) { background: #e5e7eb; }
        .pd-qty-btn:disabled { color: #ccc; cursor: default; }
        .pd-qty-value {
          width: 48px;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
        }

        /* ── Total ── */
        .pd-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-top: 1px solid #e5e7eb;
          margin-bottom: 20px;
        }
        .pd-total-label { font-size: 14px; color: #888; }
        .pd-total-price { font-size: 28px; font-weight: 800; color: #1a1a1a; }
        .pd-price-each { font-size: 13px; color: #999; }

        /* ── Buttons ── */
        .pd-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .pd-fav-btn {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          border: 2px solid #e5e7eb;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .pd-fav-btn:hover { border-color: #f43f5e; background: #fff1f2; }
        .pd-fav-btn.favorited { border-color: #f43f5e; background: #fff1f2; }

        .pd-cart-btn {
          flex: 1;
          height: 52px;
          border: none;
          border-radius: 14px;
          background: #0091A9;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s, transform 0.1s;
        }
        .pd-cart-btn:hover:not(:disabled) { background: #007a8f; }
        .pd-cart-btn:active:not(:disabled) { transform: scale(0.98); }
        .pd-cart-btn:disabled { opacity: 0.5; cursor: default; }
        .pd-cart-btn.added { background: #15803d; }

        .pd-checkout-btn {
          width: 100%;
          height: 52px;
          border: 2px solid #0091A9;
          border-radius: 14px;
          background: transparent;
          color: #0091A9;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .pd-checkout-btn:hover:not(:disabled) { background: #0091A9; color: #fff; }
        .pd-checkout-btn:disabled { opacity: 0.5; cursor: default; }

        /* ── Reviews Section ── */
        .pd-reviews-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .pd-reviews-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }
        .pd-reviews-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .pd-review-cta {
          background: #fff;
          border-radius: 16px;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
        }
        .pd-review-cta-text {
          font-size: 15px;
          color: #777;
          text-align: center;
        }
        .pd-write-review-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 12px;
          border: none;
          background: #0091A9;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s, transform 0.1s;
        }
        .pd-write-review-btn:hover { background: #007a8f; }
        .pd-write-review-btn:active { transform: scale(0.97); }

        /* ── Review Form Modal ── */
        .pd-review-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
          animation: pdModalFade 0.2s ease-out;
        }
        @keyframes pdModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pd-review-modal-card {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          position: relative;
          box-shadow: 0 16px 48px rgba(0,0,0,0.18);
        }
        .pd-review-modal-close {
          position: absolute;
          top: 16px;
          right: 18px;
          background: none;
          border: none;
          font-size: 22px;
          color: #999;
          cursor: pointer;
          line-height: 1;
        }
        .pd-review-modal-close:hover { color: #333; }
        .pd-review-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 4px;
        }
        .pd-review-modal-sub {
          font-size: 14px;
          color: #888;
          margin-bottom: 24px;
        }
        .pd-review-stars-pick {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }
        .pd-review-star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: #d1d5db;
          transition: color 0.1s, transform 0.1s;
        }
        .pd-review-star-btn.active { color: #f59e0b; }
        .pd-review-star-btn:hover { transform: scale(1.15); }
        .pd-review-star-label {
          font-size: 13px;
          color: #999;
          margin-bottom: 20px;
          min-height: 18px;
        }
        .pd-review-textarea {
          width: 100%;
          min-height: 120px;
          border: 1.5px solid #d1d5db;
          border-radius: 12px;
          padding: 14px;
          font-size: 14px;
          font-family: inherit;
          color: #1a1a2e;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 20px;
        }
        .pd-review-textarea:focus {
          border-color: #0091A9;
          box-shadow: 0 0 0 3px rgba(0,145,169,0.1);
        }
        .pd-review-textarea::placeholder { color: #bbb; }
        .pd-review-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #0091A9;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pd-review-submit-btn:hover:not(:disabled) { background: #007a8f; }
        .pd-review-submit-btn:disabled { opacity: 0.5; cursor: default; }

        /* ── Submitted Reviews List ── */
        .pd-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 20px;
        }
        .pd-review-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
        }
        .pd-review-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .pd-review-card-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e8f4f7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0091A9;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }
        .pd-review-card-meta { flex: 1; }
        .pd-review-card-name { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .pd-review-card-date { font-size: 12px; color: #999; }
        .pd-review-card-stars { display: flex; gap: 2px; color: #f59e0b; flex-shrink: 0; }
        .pd-review-card-stars .star-empty { color: #d1d5db; }
        .pd-review-card-text {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
        }

        /* ── Login Prompt Modal ── */
        .pd-login-prompt {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
        .pd-login-prompt-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 32px 32px;
          max-width: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          position: relative;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        .pd-login-prompt-close {
          position: absolute;
          top: 14px;
          right: 18px;
          background: none;
          border: none;
          font-size: 24px;
          color: #999;
          cursor: pointer;
          line-height: 1;
        }
        .pd-login-prompt-close:hover { color: #333; }
        .pd-login-prompt-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .pd-login-prompt-text {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .pd-login-prompt-btns {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        .pd-login-prompt-cancel {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
          background: #fff;
          color: #555;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s;
        }
        .pd-login-prompt-cancel:hover { background: #f3f4f6; }
        .pd-login-prompt-go {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #0091A9;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s;
        }
        .pd-login-prompt-go:hover { background: #007a8f; }

        /* ── Feedback Toast ── */
        .pd-toast {
          position: fixed;
          top: 88px;
          right: 24px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border-radius: 14px;
          padding: 14px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04);
          animation: pdToastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 380px;
        }
        @keyframes pdToastIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pd-toast-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pd-toast-icon.cart {
          background: #ecfdf5;
          color: #16a34a;
        }
        .pd-toast-icon.wishlist {
          background: #fff1f2;
          color: #f43f5e;
        }
        .pd-toast-icon.review {
          background: #fffbeb;
          color: #f59e0b;
        }
        .pd-toast-body {
          flex: 1;
          min-width: 0;
        }
        .pd-toast-title {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 2px;
        }
        .pd-toast-msg {
          font-size: 13px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pd-toast-action {
          flex-shrink: 0;
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #0091A9;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          font-family: inherit;
          transition: background 0.15s;
        }
        .pd-toast-action:hover {
          background: #e8f4f7;
        }
        @media (max-width: 500px) {
          .pd-toast {
            right: 12px;
            left: 12px;
            max-width: none;
          }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .pd-main {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .pd-image-section { position: static; }
          .pd-product-name { font-size: 26px; }
          .pd-price { font-size: 28px; }
        }
        @media (max-width: 500px) {
          .pd-main { padding: 16px; }
          .pd-product-name { font-size: 22px; }
          .pd-info-grid { grid-template-columns: 1fr; }
          .pd-actions { flex-direction: column; }
          .pd-fav-btn { width: 100%; }
        }
      `}</style>

      <Navbar cartCount={cartCount} solidBackground />

      {/* Feedback Toast */}
      {toast && (
        <div className="pd-toast" key={toast.type + toast.message}>
          <div className={`pd-toast-icon ${toast.type}`}>
            {toast.type === "cart" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : toast.type === "wishlist" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
          </div>
          <div className="pd-toast-body">
            <div className="pd-toast-title">{toast.type === "cart" ? "Added to Cart" : toast.type === "wishlist" ? "Wishlist Updated" : "Review Submitted"}</div>
            <div className="pd-toast-msg">{toast.message}</div>
          </div>
          {toast.type !== "review" && (
            <button
              className="pd-toast-action"
              onClick={() => { setToast(null); navigate(toast.type === "cart" ? "/Cart" : "/Profile"); }}
            >
              {toast.type === "cart" ? "View Cart" : "View Wishlist"}
            </button>
          )}
        </div>
      )}

      <div className="pd-page">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <a onClick={() => navigate("/")}>Home</a>
          <span>/</span>
          <a onClick={() => navigate("/ProductPage")}>Products</a>
          <span>/</span>
          <span style={{ color: "#444" }}>{product.name}</span>
        </div>

        {/* Product Main */}
        <div className="pd-main">
          {/* Image */}
          <div className="pd-image-section">
            <div className="pd-image-card">
              <div className="pd-image-wrapper">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="pd-tags">
                {tags.map((tag) => (
                  <span key={tag} className="pd-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="pd-details">
            <div className="pd-location-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{product.location}, Philippines</span>
            </div>

            <h1 className="pd-product-name">{product.name}</h1>

            <div className="pd-rating-row">
              <div className="pd-stars">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={s <= Math.round(product.rating || 0) ? "" : "star-empty"}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={s <= Math.round(product.rating || 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </span>
                ))}
              </div>
              <span className="pd-rating-score">{(product.rating || 0).toFixed(1)}</span>
              <span className="pd-review-count">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{"\u20B1"}{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="pd-original-price">{"\u20B1"}{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="pd-description">{product.description}</p>

            <div className="pd-info-grid">
              <div className="pd-info-item">
                <span className="pd-info-label">Seller</span>
                <span className="pd-info-value">{product.seller}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Material</span>
                <span className="pd-info-value">{product.material}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Stock</span>
                <span className="pd-info-value">{isOutOfStock ? "Out of stock" : `${product.stock} available`}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Origin</span>
                <span className="pd-info-value">{product.location}, Philippines</span>
              </div>
            </div>

            <div className="pd-delivery">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Estimated delivery: <strong>{product.deliveryTime}</strong></span>
            </div>

            {/* Quantity */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Quantity</span>
              <div className="pd-qty-controls">
                <button className="pd-qty-btn" disabled={isOutOfStock || qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span className="pd-qty-value">{qty}</span>
                <button className="pd-qty-btn" disabled={isOutOfStock || qty >= product.stock} onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            {/* Total */}
            <div className="pd-total-row">
              <div>
                <div className="pd-total-label">Total</div>
                {qty > 1 && <div className="pd-price-each">{"\u20B1"}{product.price.toLocaleString()} each</div>}
              </div>
              <span className="pd-total-price">{"\u20B1"}{totalPrice.toLocaleString()}</span>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button
                className={`pd-fav-btn${isFavorited ? " favorited" : ""}`}
                onClick={handleFavorite}
                disabled={favLoading}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorited ? "#f43f5e" : "none"} stroke={isFavorited ? "#f43f5e" : "#999"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button
                className={`pd-cart-btn${added ? " added" : ""}`}
                disabled={isOutOfStock || qty < 1}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </>
                )}
              </button>
            </div>
            <button
              className="pd-checkout-btn"
              disabled={isOutOfStock || qty < 1}
              onClick={handleCheckout}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="pd-reviews-section">
          <div className="pd-reviews-header">
            <h2 className="pd-reviews-title">Customer Reviews</h2>
          </div>

          <div className="pd-review-cta">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0091A9" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="pd-review-cta-text">Share your experience with this product</p>
            <button className="pd-write-review-btn" onClick={handleWriteReview}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Write a Review
            </button>
          </div>

          {/* Submitted Reviews */}
          {reviews.length > 0 && (
            <div className="pd-reviews-list">
              {reviews.map((r) => {
                const name = `${r.first_name || ""} ${r.last_name || ""}`.trim() || "Customer";
                const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
                const rVal = Number(r.rating || 0);
                const date = new Date(r.created_at);
                const dateStr = !isNaN(date.getTime()) ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
                return (
                  <div key={r.id} className="pd-review-card">
                    <div className="pd-review-card-top">
                      <div className="pd-review-card-avatar">{initials}</div>
                      <div className="pd-review-card-meta">
                        <div className="pd-review-card-name">{name}</div>
                        <div className="pd-review-card-date">{dateStr}</div>
                      </div>
                      <div className="pd-review-card-stars">
                        {[1,2,3,4,5].map((s) => (
                          <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rVal ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="pd-review-card-text">{r.comment}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="pd-review-modal" onClick={(e) => e.target === e.currentTarget && setShowReviewForm(false)}>
              <div className="pd-review-modal-card">
                <button className="pd-review-modal-close" onClick={() => setShowReviewForm(false)}>&times;</button>
                <h3 className="pd-review-modal-title">Write a Review</h3>
                <p className="pd-review-modal-sub">How was your experience with {product.name}?</p>

                <div className="pd-review-stars-pick">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`pd-review-star-btn${s <= (reviewHover || reviewRating) ? " active" : ""}`}
                      onClick={() => setReviewRating(s)}
                      onMouseEnter={() => setReviewHover(s)}
                      onMouseLeave={() => setReviewHover(0)}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={s <= (reviewHover || reviewRating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="pd-review-star-label">
                  {reviewRating === 1 && "Poor"}
                  {reviewRating === 2 && "Fair"}
                  {reviewRating === 3 && "Good"}
                  {reviewRating === 4 && "Very Good"}
                  {reviewRating === 5 && "Excellent"}
                </div>

                <textarea
                  className="pd-review-textarea"
                  placeholder="Tell us about your experience with this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />

                <button
                  className="pd-review-submit-btn"
                  disabled={reviewRating === 0 || !reviewComment.trim() || reviewSubmitting}
                  onClick={handleSubmitReview}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}

          {/* Login Prompt */}
          {showLoginPrompt && (
            <div className="pd-login-prompt">
              <div className="pd-login-prompt-card">
                <button className="pd-login-prompt-close" onClick={() => setShowLoginPrompt(false)}>&times;</button>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0091A9" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <h3 className="pd-login-prompt-title">Login Required</h3>
                <p className="pd-login-prompt-text">You need to be logged in to write a review. Please log in or create an account first.</p>
                <div className="pd-login-prompt-btns">
                  <button className="pd-login-prompt-cancel" onClick={() => setShowLoginPrompt(false)}>Cancel</button>
                  <button className="pd-login-prompt-go" onClick={() => navigate("/Login")}>Go to Login</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
