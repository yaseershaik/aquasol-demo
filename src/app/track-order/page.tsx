"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatINR } from "@/lib/format";
import {
  Search,
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  MapPin,
  ExternalLink,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams?.get("ref") || "";
  const initialPhone = searchParams?.get("phone") || "";

  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<{
    type: "ORDER" | "INSPECTION";
    data: any;
  } | null>(null);

  const performLookup = async (refNum: string, phoneNum: string) => {
    if (!refNum || !phoneNum) return;
    setLoading(true);
    setErrorMsg(null);
    setLookupResult(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceNumber: refNum,
          phone: phoneNum,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "No order or booking was found with those details."
        );
      }

      setLookupResult({
        type: data.type,
        data: data.data,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to query reference records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef && initialPhone) {
      performLookup(initialRef, initialPhone);
    }
  }, [initialRef, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(referenceNumber, phone);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
          Track Order or Site Inspection
        </h1>
        <p className="text-xs sm:text-sm text-[#525252] mt-0.5">
          Enter your reference ID (e.g. ORD-... or INS-...) and registered mobile number to view live status.
        </p>
      </div>

      {/* Query Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] border border-[#E5E5E5] p-6 rounded space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
              Reference Number *
            </label>
            <input
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. ORD-123456 or INS-789012"
              className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A] font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
              Registered Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-interactive w-full sm:w-auto px-6 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-[#FFFFFF] text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? "Searching Records..." : "Search Reference Status"}
        </button>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded flex items-start gap-3 text-[#991B1B] text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Lookup Unsuccessful</p>
            <p className="text-xs mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Results Box */}
      {lookupResult && lookupResult.type === "ORDER" && (
        <div className="bg-[#FFFFFF] border border-[#0A0A0A] rounded p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0A0A0A] text-[#FFFFFF] rounded">
                Product Order
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] mt-1 font-mono">
                {lookupResult.data.orderNumber || lookupResult.data.order_number}
              </h2>
              <p className="text-xs text-[#525252]">
                Placed on {new Date(lookupResult.data.createdAt || lookupResult.data.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#525252] block">Current Status</span>
              <span className="text-sm font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded inline-block mt-0.5">
                {lookupResult.data.orderStatus || lookupResult.data.order_status}
              </span>
            </div>
          </div>

          {/* Courier Details if Shipped */}
          {(lookupResult.data.courierName || lookupResult.data.courier_name) && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded space-y-1 text-xs text-[#166534]">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Truck className="w-4 h-4" />
                <span>Courier Dispatch Details</span>
              </div>
              <p>
                Carrier: <strong>{lookupResult.data.courierName || lookupResult.data.courier_name}</strong> | Tracking Number:{" "}
                <strong className="font-mono">{lookupResult.data.trackingNumber || lookupResult.data.tracking_number || "Assigned"}</strong>
              </p>
            </div>
          )}

          {/* Order Summary & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#525252]">
            <div className="space-y-1.5">
              <span className="font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Delivery Address:
              </span>
              <p className="font-medium text-[#0A0A0A]">
                {lookupResult.data.customerName || lookupResult.data.customer_name}
                <br />
                {lookupResult.data.shippingAddress || lookupResult.data.shipping_address}
                <br />
                Pincode: {lookupResult.data.pincode}
                <br />
                Phone: {lookupResult.data.customerPhone || lookupResult.data.customer_phone}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Billing Breakdown:
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatINR(lookupResult.data.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>{formatINR(lookupResult.data.gstAmount ?? lookupResult.data.taxTotal ?? lookupResult.data.tax_total ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatINR(lookupResult.data.shippingFee ?? 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#0A0A0A] pt-1 border-t border-[#E5E5E5]">
                  <span>Total Amount:</span>
                  <span>{formatINR(lookupResult.data.totalAmount ?? lookupResult.data.total_amount)}</span>
                </div>
                <div className="flex justify-between pt-1 text-[11px]">
                  <span>Payment:</span>
                  <span className="font-semibold text-[#0A0A0A]">
                    {lookupResult.data.paymentMethod || lookupResult.data.payment_method} ({lookupResult.data.paymentStatus || lookupResult.data.payment_status})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items List */}
          <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A0A0A]">
              Items In This Order:
            </h3>
            <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded">
              {lookupResult.data.items?.map((item: any) => {
                const itemPrice = item.unitPrice ?? item.price ?? 0;
                return (
                  <div
                    key={item.id}
                    className="p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#0A0A0A]">{item.productName || item.product_name}</span>
                      {item.sku && <span className="text-[#737373] ml-2 font-mono">(SKU: {item.sku})</span>}
                    </div>
                    <div className="text-right">
                      <span>
                        {item.quantity} × {formatINR(itemPrice)}
                      </span>
                      <span className="font-bold text-[#0A0A0A] ml-4">
                        {formatINR(itemPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {lookupResult && lookupResult.type === "INSPECTION" && (
        <div className="bg-[#FFFFFF] border border-[#0A0A0A] rounded p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0A0A0A] text-[#FFFFFF] rounded">
                Site Inspection Booking
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] mt-1 font-mono">
                {lookupResult.data.bookingNumber || lookupResult.data.bookingReference || lookupResult.data.booking_reference}
              </h2>
              <p className="text-xs text-[#525252]">
                Service:{" "}
                <strong>
                  {(lookupResult.data.serviceType || lookupResult.data.vertical) === "COMMERCIAL_RO"
                    ? "Commercial RO Water Plant"
                    : "Residential Rooftop Solar"}
                </strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#525252] block">Booking Status</span>
              <span className="text-sm font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded inline-block mt-0.5">
                {lookupResult.data.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#525252]">
            <div className="space-y-2">
              <span className="font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Scheduled Visit:
              </span>
              <div className="p-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#0A0A0A]">
                  <Calendar className="w-3.5 h-3.5" /> Date: {lookupResult.data.preferredDate || lookupResult.data.preferred_date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Time Window: {lookupResult.data.timeSlot || lookupResult.data.preferredTimeSlot || lookupResult.data.preferred_time_slot}
                </div>
                {(lookupResult.data.assignedTech || lookupResult.data.assignedTechnician || lookupResult.data.assigned_technician) ? (
                  <div className="flex items-center gap-1.5 text-[#166534] font-medium pt-1">
                    <User className="w-3.5 h-3.5" /> Assigned Engineer: {lookupResult.data.assignedTech || lookupResult.data.assignedTechnician || lookupResult.data.assigned_technician}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#737373] pt-1">
                    Technician assignment in progress. You will receive an SMS prior to arrival.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Site Location & Contact:
              </span>
              <div className="p-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded space-y-1">
                <p className="font-semibold text-[#0A0A0A]">{lookupResult.data.customerName || lookupResult.data.customer_name}</p>
                <p>{lookupResult.data.address} - {lookupResult.data.pincode}</p>
                <p>Phone: {lookupResult.data.customerPhone || lookupResult.data.customer_phone}</p>
              </div>
            </div>
          </div>

          {lookupResult.data.notes && (
            <div className="p-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded text-xs">
              <span className="font-semibold text-[#0A0A0A]">Client Special Instructions:</span>
              <p className="text-[#525252] mt-0.5">{lookupResult.data.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-[#525252]">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
