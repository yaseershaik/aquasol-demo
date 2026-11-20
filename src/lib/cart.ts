"use client";

export interface CartItem {
  productId: string;
  id?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  gstPercent: number;
  stockQuantity: number;
  maxStock?: number;
  imageUrl?: string;
  image?: string;
  vertical?: string;
  quantity: number;
}

const CART_STORAGE_KEY = "puregrid_cart_v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Normalize properties
    return parsed.map((item) => ({
      ...item,
      productId: item.productId || item.id,
      id: item.productId || item.id,
      stockQuantity: typeof item.stockQuantity === "number" ? item.stockQuantity : item.maxStock ?? 0,
      maxStock: typeof item.stockQuantity === "number" ? item.stockQuantity : item.maxStock ?? 0,
      imageUrl: item.imageUrl || item.image,
      image: item.imageUrl || item.image,
    }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("puregrid-cart-updated"));
    window.dispatchEvent(new Event("cart_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to save cart to localStorage", err);
  }
}

export function getCartCount(): number {
  const items = getCart();
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

export function addToCart(
  item: {
    productId: string;
    id?: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    gstPercent: number;
    stockQuantity: number;
    imageUrl?: string;
    image?: string;
    vertical?: string;
  },
  quantity = 1
): { success: boolean; message: string; cart: CartItem[] } {
  const cart = getCart();
  const prodId = item.productId || item.id || "";
  const existing = cart.find((i) => i.productId === prodId);
  const availableStock = item.stockQuantity ?? 0;

  if (availableStock <= 0) {
    return { success: false, message: "Sorry, this item is out of stock.", cart };
  }

  if (existing) {
    const nextQty = existing.quantity + quantity;
    if (nextQty > availableStock) {
      existing.quantity = availableStock;
      saveCart(cart);
      return {
        success: false,
        message: `Only ${availableStock} units available in stock. Cart updated to maximum limit.`,
        cart,
      };
    }
    existing.quantity = nextQty;
  } else {
    const safeQty = Math.min(quantity, availableStock);
    cart.push({
      productId: prodId,
      id: prodId,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      price: item.price,
      gstPercent: item.gstPercent,
      stockQuantity: availableStock,
      maxStock: availableStock,
      imageUrl: item.imageUrl || item.image,
      image: item.imageUrl || item.image,
      vertical: item.vertical,
      quantity: safeQty,
    });
  }

  saveCart(cart);
  return { success: true, message: "Added to cart successfully.", cart };
}

export function updateCartItemQuantity(productId: string, quantity: number): CartItem[] {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  } else {
    const item = cart.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.min(quantity, item.stockQuantity || 1);
    }
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  return updateCartItemQuantity(productId, quantity);
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event("puregrid-cart-updated"));
    window.dispatchEvent(new Event("cart_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to clear cart", err);
  }
}

export function getCartSummary(customShipping?: { flatFee?: number; freeAbove?: number }) {
  const items = getCart();
  let subtotal = 0;
  let totalGst = 0;
  let itemCount = 0;

  for (const item of items) {
    const lineTotal = item.price * item.quantity;
    const lineGst = lineTotal * (item.gstPercent / 100);
    subtotal += lineTotal;
    totalGst += lineGst;
    itemCount += item.quantity;
  }

  const shippingFlatFee = customShipping?.flatFee !== undefined ? customShipping.flatFee : 99;
  const freeShippingAbove = customShipping?.freeAbove !== undefined ? customShipping.freeAbove : 2500;
  const shippingFee = subtotal >= freeShippingAbove || items.length === 0 ? 0 : shippingFlatFee;
  const finalTotal = Math.round((subtotal + totalGst + shippingFee) * 100) / 100;

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    shippingFee,
    finalTotal,
    freeShippingAbove,
    shippingFlatFee,
  };
}
