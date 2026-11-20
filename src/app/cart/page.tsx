"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartSummary,
  CartItem,
} from "@/lib/cart";
import { formatINR } from "@/lib/format";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  AlertCircle,
  Package,
} from "lucide-react";

export default function CartPage() {
  const { config } = useSiteConfig();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadCart = () => {
    setItems(getCart());
  };

  useEffect(() => {
    setMounted(true);
    loadCart();

    const handleUpdate = () => loadCart();
    window.addEventListener("puregrid-cart-updated", handleUpdate);
    return () => window.removeEventListener("puregrid-cart-updated", handleUpdate);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center text-[#525252]">
        Loading your shopping cart...
      </div>
    );
  }

  const summary = getCartSummary({
    flatFee: config.shippingFlatFee,
    freeAbove: config.freeShippingAbove,
  });
  const hasOutOfStockItems = items.some((item) => item.stockQuantity <= 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto text-[#0A0A0A]">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-[#525252] max-w-sm mx-auto">
          You have not added any spare parts or components yet. Browse our catalog for authentic RO membranes, pumps, and solar inverters.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-[#FFFFFF] text-sm font-semibold rounded hover:bg-[#262626]"
          >
            Browse Spare Parts Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
            Shopping Cart ({summary.itemCount} items)
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Review your selected industrial components and live inventory allocation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to clear all items from your cart?")) {
              clearCart();
            }
          }}
          className="text-xs text-[#DC2626] hover:underline self-start sm:self-auto flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {hasOutOfStockItems && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded flex items-start gap-3 text-[#991B1B] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Attention:</span> One or more items in your cart are currently out of stock. Please remove them before proceeding to checkout.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Line Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-[#E5E5E5] rounded divide-y divide-[#E5E5E5] bg-[#FFFFFF]">
            {items.map((item) => {
              const isItemOutOfStock = item.stockQuantity <= 0;
              const isAtMaxStock = item.quantity >= item.stockQuantity;

              return (
                <div
                  key={item.productId}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#F9F9F9] border border-[#E5E5E5] rounded flex items-center justify-center p-1 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = "/images/real/ro-membrane-4040.jpg";
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400 stroke-[1.5]" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-[#525252] font-mono">
                        SKU: {item.sku}
                      </div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-semibold text-[#0A0A0A] hover:underline line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-[#525252]">
                        {formatINR(item.price)} each{" "}
                        <span className="text-[11px] text-[#737373]">
                          (+ {item.gstPercent}% GST)
                        </span>
                      </div>

                      {/* Stock Alert */}
                      {isItemOutOfStock ? (
                        <span className="inline-block text-[11px] font-bold text-[#DC2626]">
                          Out of stock — Please remove to checkout
                        </span>
                      ) : (
                        <span className="inline-block text-[11px] text-[#166534]">
                          {item.stockQuantity} units available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity Controls & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]">
                    {/* Qty Controls */}
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center border border-[#E5E5E5] rounded bg-[#FFFFFF]">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 text-[#0A0A0A] hover:bg-[#F9F9F9]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#0A0A0A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                          disabled={isAtMaxStock || isItemOutOfStock}
                          className="p-1.5 text-[#0A0A0A] hover:bg-[#F9F9F9] disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-[#737373] hover:text-[#DC2626] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#0A0A0A]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#525252] pt-2">
            <Link href="/products" className="hover:text-[#0A0A0A] underline">
              ← Continue shopping spare parts
            </Link>
            <span>Ships Pan-India via Express Surface Transport</span>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0A0A0A] pb-3 border-b border-[#E5E5E5]">
              Order Price Breakdown
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#525252]">
                <span>Component Subtotal</span>
                <span className="font-medium text-[#0A0A0A]">{formatINR(summary.subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#525252]">
                <span>Applicable GST (Calculated)</span>
                <span className="font-medium text-[#0A0A0A]">{formatINR(summary.totalGst)}</span>
              </div>

              <div className="flex justify-between text-[#525252]">
                <span>Flat Surface Shipping</span>
                <span className="font-medium text-[#0A0A0A]">
                  {summary.shippingFee === 0 ? (
                    <span className="text-[#166534] font-semibold">FREE</span>
                  ) : (
                    formatINR(summary.shippingFee)
                  )}
                </span>
              </div>

              {summary.subtotal < config.freeShippingAbove && (
                <p className="text-[11px] text-[#737373] bg-[#F9F9F9] p-2 rounded">
                  Add {formatINR(config.freeShippingAbove - summary.subtotal)} more to qualify for <strong>Free Shipping</strong> across India.
                </p>
              )}

              <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-baseline">
                <span className="text-base font-bold text-[#0A0A0A]">Total Payable</span>
                <span className="text-2xl font-black text-[#0A0A0A]">
                  {formatINR(summary.finalTotal)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={hasOutOfStockItems ? "#" : "/checkout"}
                className={`btn-interactive w-full py-3.5 text-center text-sm font-bold rounded-lg inline-flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  hasOutOfStockItems
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-[#0284C7] text-[#FFFFFF] hover:bg-[#0369A1]"
                }`}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-3 border-t border-[#E5E5E5] space-y-2 text-[11px] text-[#525252]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0A0A0A]" />
                <span>100% Secure Checkout & GST Tax Invoice</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0A0A0A]" />
                <span>Supports Cash on Delivery & Online Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
