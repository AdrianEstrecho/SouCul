/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Categories from "./Categories";
import Products from "./Products";
import Footer from "./Footer";

import fallbackImage from "../assets/Shirt.png";

function resolveImageUrl(rawUrl) {
  const value = String(rawUrl || "").trim();

  if (!value) {
    return fallbackImage;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `/${value.replace(/^\/+/, "")}`;
}

function mapProduct(row, fallbackLocation) {
  return {
    id: Number(row.id),
    name: row.name || "Product",
    description: row.description || "",
    location: row.location_name || fallbackLocation,
    price: Number(row.discount_price ?? row.price ?? 0),
    image: resolveImageUrl(row.featured_image_url),
    stock: Math.max(0, Number(row.quantity_in_stock ?? 0)),
  };
}

export default function LocationCategoryPage({
  cartCount,
  onAddToCart,
  onDirectCheckout,
  locationName,
  locationSlug,
  categoryName,
  categorySlug,
}) {
  const [activeCategory, setActiveCategory] = useState(categoryName);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const heroSection = useMemo(() => [{ title: categoryName, place: locationName }], [categoryName, locationName]);

  useEffect(() => {
    setActiveCategory(categoryName);
  }, [categoryName]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const api = window.CustomerAPI || window.customerAPI;
        if (!api || typeof api.getProducts !== "function") {
          throw new Error("Customer API client is unavailable.");
        }

        const response = await api.getProducts({
          location: locationSlug,
          category: categorySlug,
          page: 1,
          per_page: 500,
        });

        const rows = Array.isArray(response?.data) ? response.data : [];
        const mapped = rows.map((row) => mapProduct(row, locationName));

        if (isMounted) {
          setProducts(mapped);
        }
      } catch (fetchError) {
        console.error("Failed to load products from database:", fetchError);
        if (isMounted) {
          setProducts([]);
          setError("Unable to load products from the database right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [categorySlug, locationName, locationSlug]);

  return (
    <div className="soucul-app">
      <Navbar cartCount={cartCount} />
      <Hero hero={heroSection} />
      <Categories activeCategory={activeCategory} onSelect={setActiveCategory} location={locationName} />

      {loading && (
        <div style={{ textAlign: "center", padding: "24px 16px", color: "#5c5c5c", fontWeight: 600 }}>
          Loading products from database...
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: "center", padding: "24px 16px", color: "#b3261e", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 16px", color: "#5c5c5c", fontWeight: 600 }}>
          No products found for this category yet.
        </div>
      )}

      <Products products={products} onAddToCart={onAddToCart} onDirectCheckout={onDirectCheckout} />
      <Footer />
    </div>
  );
}
