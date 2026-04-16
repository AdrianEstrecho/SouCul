const KEY = "soucul_local_wishlist";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function getLocalWishlist() {
  return read();
}

export function addToLocalWishlist(product) {
  const list = read();
  if (list.some((i) => Number(i.product_id) === Number(product.id))) return;
  list.unshift({
    product_id: product.id,
    name: product.name || "Product",
    location: product.location || "SouCul",
    price: product.price || 0,
    image: product.image || product.imageUrl || product.img || "",
  });
  write(list);
}

export function removeFromLocalWishlist(productId) {
  const list = read().filter((i) => Number(i.product_id) !== Number(productId));
  write(list);
}

export function isInLocalWishlist(productId) {
  return read().some((i) => Number(i.product_id) === Number(productId));
}
