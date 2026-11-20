"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { getCart, clearCart, getCartSummary, CartItem } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { getStoredUser, UserProfile } from "@/lib/user-auth";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Package,
  UserCheck,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { config } = useSiteConfig();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Andhra Pradesh");
  const [pincode, setPincode] = useState("");
  const [gstin, setGstin] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  // Sync default payment method with site config
  useEffect(() => {
    if (!config.codEnabled && config.onlinePayEnabled) {
      setPaymentMethod("ONLINE");
    } else if (config.codEnabled) {
      setPaymentMethod("COD");
    }
  }, [config.codEnabled, config.onlinePayEnabled]);

  // State management
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
    const cartItems = getCart();
    setItems(cartItems);

    const user = getStoredUser();
    if (user) {
      setLoggedInUser(user);
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
      if (user.address) setShippingAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.pincode) setPincode(user.pincode);
      if (user.gstin) setGstin(user.gstin);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#525252]">
        Initializing checkout...
      </div>
    );
  }

  const summary = getCartSummary({
    flatFee: config.shippingFlatFee,
    freeAbove: config.freeShippingAbove,
  });

  // If cart is empty and no order completed yet
  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <Package className="w-12 h-12 text-gray-400 mx-auto stroke-[1.5]" />
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Your Cart is Empty</h1>
        <p className="text-sm text-[#525252]">
          You have no items in your cart to checkout. Please add products to proceed.
        </p>
        <div>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-[#0A0A0A] text-[#FFFFFF] text-sm font-semibold rounded hover:bg-[#262626]"
          >
            Go to Spare Parts Store
          </Link>
        </div>
      </div>
    );
  }

  // If order was successfully completed
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6">
        <div className="bg-[#FFFFFF] border border-[#0A0A0A] rounded p-6 sm:p-10 space-y-6 text-[#0A0A0A]">
          <div className="flex items-center gap-3 text-[#166534]">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Order Confirmed!</h1>
              <p className="text-xs text-[#525252] mt-0.5">
                Thank you for your order. We are preparing your components for dispatch.
              </p>
            </div>
          </div>

          <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-5 rounded space-y-3 text-sm">
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#525252]">Order Reference:</span>
              <span className="font-mono font-bold text-[#0A0A0A]">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#525252]">Payment Method:</span>
              <span className="font-semibold text-[#0A0A0A]">
                {completedOrder.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#525252]">Payment Status:</span>
              <span className="font-semibold text-[#166534]">{completedOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#525252]">Delivery Address:</span>
              <span className="text-right font-medium max-w-xs">
                {completedOrder.customerName}, {completedOrder.shippingAddress}, {completedOrder.city}, {completedOrder.state} - {completedOrder.pincode}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-base font-bold text-[#0A0A0A]">Total Billed:</span>
              <span className="text-lg font-black text-[#0A0A0A]">{formatINR(completedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/track-order?ref=${completedOrder.orderNumber}&phone=${completedOrder.customerPhone}`}
              className="flex-1 text-center py-3 bg-[#0A0A0A] text-[#FFFFFF] text-sm font-semibold rounded hover:bg-[#262626] inline-flex items-center justify-center gap-1.5"
            >
              Track Order Dispatch <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="flex-1 text-center py-3 border border-[#E5E5E5] text-[#0A0A0A] text-sm font-semibold rounded hover:bg-[#F9F9F9]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aquasol_user_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const orderPayload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail?.trim() || "customer@aquasol.com",
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || "customer@aquasol.com",
        shipping_address: shippingAddress.trim(),
        shippingAddress: shippingAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        gstin: gstin?.trim() || undefined,
        payment_method: paymentMethod,
        paymentMethod: paymentMethod,
        items: items.map((i) => ({
          product_id: i.productId,
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      let res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (res.status === 404) {
        res = await fetch("/api/py/orders", {
          method: "POST",
          headers,
          body: JSON.stringify(orderPayload),
        });
      }

      const resData = await res.json().catch(() => null);

      if (!res.ok || (resData && resData.success === false)) {
        throw new Error(resData?.error || resData?.detail || "Failed to process order.");
      }

      const ord = resData?.order || resData || {};

      clearCart();
      setCompletedOrder({
        orderNumber: ord.orderNumber || ord.order_number,
        customerName: ord.customerName || ord.customer_name,
        customerPhone: ord.customerPhone || ord.customer_phone,
        customerEmail: ord.customerEmail || ord.customer_email,
        shippingAddress: ord.shippingAddress || ord.shipping_address,
        city: ord.city || city,
        state: ord.state || state,
        pincode: ord.pincode,
        paymentMethod: ord.paymentMethod || ord.payment_method,
        paymentStatus: ord.paymentStatus || ord.payment_status,
        totalAmount: ord.totalAmount || ord.total_amount,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-[#E5E5E5] pb-4 space-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
            Secure Checkout
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Enter your delivery destination and select payment terms.
          </p>
        </div>
        {loggedInUser && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Signed in as <strong>{loggedInUser.name}</strong> ({loggedInUser.email}). Your dispatch and invoices will automatically link to your customer account.
              </span>
            </div>
            <Link href="/account" className="font-bold underline text-emerald-900 ml-2 whitespace-nowrap">
              View Account
            </Link>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded flex items-start gap-3 text-[#991B1B] text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Checkout Notice:</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shipping Info & Payment Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Form Card */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-6 rounded space-y-4">
            <h2 className="text-base font-bold text-[#0A0A0A] pb-2 border-b border-[#E5E5E5] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0A0A0A]" /> Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Email Address (For Invoicing & Dispatch Notifications)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. suresh@example.com"
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Street Address / Facility Location *
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House / Unit No., Industrial Area, Street, Landmark"
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Vijayawada"
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Andhra Pradesh"
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 520001"
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-6 rounded space-y-4">
            <h2 className="text-base font-bold text-[#0A0A0A] pb-2 border-b border-[#E5E5E5] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0A0A0A]" /> Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.codEnabled ? (
                <label
                  className={`p-4 border rounded cursor-pointer flex flex-col justify-between transition-colors ${
                    paymentMethod === "COD"
                      ? "border-[#0A0A0A] bg-[#F9F9F9]"
                      : "border-[#E5E5E5] hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0A0A0A]">
                      Cash on Delivery (COD)
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-[#0A0A0A]"
                    />
                  </div>
                  <p className="text-xs text-[#525252] mt-2">
                    Pay with cash or UPI at the time of component delivery.
                  </p>
                </label>
              ) : (
                <div className="p-4 border border-dashed border-slate-200 bg-slate-50 rounded opacity-60">
                  <span className="text-xs font-bold text-slate-500">Cash on Delivery (Unavailable)</span>
                  <p className="text-[11px] text-slate-400 mt-1">Temporarily disabled for maintenance.</p>
                </div>
              )}

              {config.onlinePayEnabled ? (
                <label
                  className={`p-4 border rounded cursor-pointer flex flex-col justify-between transition-colors ${
                    paymentMethod === "ONLINE"
                      ? "border-[#0A0A0A] bg-[#F9F9F9]"
                      : "border-[#E5E5E5] hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0A0A0A]">
                      Online Payment (Instant)
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={() => setPaymentMethod("ONLINE")}
                      className="accent-[#0A0A0A]"
                    />
                  </div>
                  <p className="text-xs text-[#525252] mt-2">
                    Pay securely via UPI, Debit/Credit Card, or Netbanking.
                  </p>
                </label>
              ) : (
                <div className="p-4 border border-dashed border-slate-200 bg-slate-50 rounded opacity-60">
                  <span className="text-xs font-bold text-slate-500">Online Payment Gateway (Unavailable)</span>
                  <p className="text-[11px] text-slate-400 mt-1">Temporarily disabled for maintenance.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order Button */}
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0A0A0A] pb-3 border-b border-[#E5E5E5]">
              Order Summary ({summary.itemCount} items)
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-[#E5E5E5] pr-1">
              {items.map((item) => (
                <div key={item.productId} className="pt-2 first:pt-0 flex justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#0A0A0A] line-clamp-1">{item.name}</p>
                    <p className="text-[#525252]">
                      Qty: {item.quantity} × {formatINR(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-[#0A0A0A] shrink-0 ml-2">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E5E5E5] space-y-2 text-sm">
              <div className="flex justify-between text-[#525252]">
                <span>Component Subtotal</span>
                <span className="font-medium text-[#0A0A0A]">{formatINR(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#525252]">
                <span>GST Tax (Included)</span>
                <span className="font-medium text-[#0A0A0A]">{formatINR(summary.totalGst)}</span>
              </div>
              <div className="flex justify-between text-[#525252]">
                <span>Shipping Fee</span>
                <span className="font-medium text-[#0A0A0A]">
                  {summary.shippingFee === 0 ? "FREE" : formatINR(summary.shippingFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-baseline">
                <span className="text-base font-bold text-[#0A0A0A]">Total Amount</span>
                <span className="text-2xl font-black text-[#0A0A0A]">
                  {formatINR(summary.finalTotal)}
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-interactive w-full py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-[#FFFFFF] text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting
                  ? "Processing Order & Checking Live Stock..."
                  : paymentMethod === "COD"
                  ? "Place Cash on Delivery Order"
                  : "Proceed to Payment"}
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[#737373] text-center">
              By confirming your order, you agree to our terms of commercial equipment warranty and delivery policy.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
