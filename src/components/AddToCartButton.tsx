"use client";

import React, { useState, useEffect } from "react";
import { addToCart, getCart } from "@/lib/cart";
import { ShoppingBag, Check, Plus, Minus, AlertCircle } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    gstPercent: number;
    stockQuantity: number;
    images?: string;
    vertical?: string;
  };
  showQtySelector?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  showQtySelector = false,
  className = "",
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [currentInCart, setCurrentInCart] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const isOutOfStock = product.stockQuantity <= 0;

  const checkCart = () => {
    const items = getCart();
    const existing = items.find((i) => i.productId === product.id);
    setCurrentInCart(existing ? existing.quantity : 0);
  };

  useEffect(() => {
    checkCart();
    const handleUpdate = () => checkCart();
    window.addEventListener("puregrid-cart-updated", handleUpdate);
    return () => window.removeEventListener("puregrid-cart-updated", handleUpdate);
  }, [product.id]);

  const maxAddable = Math.max(0, product.stockQuantity - currentInCart);

  const handleAdd = () => {
    if (isOutOfStock) return;
    if (maxAddable <= 0) {
      setFeedbackMsg(`Maximum available stock (${product.stockQuantity}) is already in your cart.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
      return;
    }

    const qtyToAdd = Math.min(quantity, maxAddable);

    let firstImage: string | undefined;
    try {
      if (product.images) {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          firstImage = parsed[0];
        }
      }
    } catch {
      // fallback
    }

    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        gstPercent: product.gstPercent,
        stockQuantity: product.stockQuantity,
        imageUrl: firstImage,
        vertical: product.vertical,
      },
      qtyToAdd
    );

    setAddedSuccess(true);
    setFeedbackMsg(null);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  if (isOutOfStock) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <button
          type="button"
          disabled
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 border border-slate-200 text-sm font-semibold rounded-lg cursor-not-allowed"
        >
          <AlertCircle className="w-4 h-4" />
          Out of Stock
        </button>
        <p className="text-[11px] text-center text-slate-400">
          Currently unavailable. Restock scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showQtySelector && (
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Quantity:
          </span>
          <div className="inline-flex items-center border border-[#CBD5E1] rounded-lg bg-[#FFFFFF] shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-[#0F172A]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxAddable || 1, q + 1))}
              disabled={quantity >= maxAddable}
              className="p-2 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-medium text-slate-500">
            ({product.stockQuantity} available)
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={maxAddable <= 0}
        className={`btn-interactive w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-sm ${
          addedSuccess
            ? "bg-[#166534] text-[#FFFFFF]"
            : maxAddable <= 0
            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            : "bg-[#0A192F] hover:bg-[#0284C7] text-[#FFFFFF]"
        }`}
      >
        {addedSuccess ? (
          <>
            <Check className="w-4 h-4" /> Added to Cart
          </>
        ) : maxAddable <= 0 ? (
          "Max Stock in Cart"
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </>
        )}
      </button>

      {feedbackMsg && (
        <p className="text-xs text-[#DC2626] text-center font-medium">
          {feedbackMsg}
        </p>
      )}

      {currentInCart > 0 && maxAddable > 0 && (
        <p className="text-[11px] text-center text-slate-500 font-medium">
          {currentInCart} unit(s) currently in your cart.
        </p>
      )}
    </div>
  );
}
