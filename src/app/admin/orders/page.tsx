"use client";

import React, { useState, useEffect } from "react";
import { formatINR } from "@/lib/format";
import {
  ShoppingCart,
  Truck,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Search,
  Filter,
  Send,
  ExternalLink,
  Package,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Droplets,
  Sun,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  courierName?: string | null;
  trackingNumber?: string | null;
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Manage Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  // Invoice Print Preview Modal
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const url = statusFilter !== "ALL" ? `/api/orders?status=${statusFilter}` : "/api/orders";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.error || "Failed to load orders");
      }
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || "Unable to reach fulfillment server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openOrderModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewOrderStatus(ord.orderStatus);
    setNewPaymentStatus(ord.paymentStatus);
    setCourierName(ord.courierName || "Blue Dart Express");
    setTrackingNumber(ord.trackingNumber || "");
    setUpdateFeedback(null);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    setUpdateFeedback(null);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
          courierName: courierName.trim() || null,
          trackingNumber: trackingNumber.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order");
      }

      setUpdateFeedback("Order & courier tracking updated! Customer notification dispatched.");
      fetchOrders();

      // Update selected order view
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: newOrderStatus,
              paymentStatus: newPaymentStatus,
              courierName: courierName.trim() || null,
              trackingNumber: trackingNumber.trim() || null,
            }
          : null
      );
    } catch (err: any) {
      setUpdateFeedback(err.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.customerName.toLowerCase().includes(q) ||
      ord.customerPhone.includes(q) ||
      ord.city.toLowerCase().includes(q) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(q))
    );
  });

  const statusTabs = [
    { label: "All Orders", value: "ALL" },
    { label: "Placed", value: "PLACED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Packed", value: "PACKED" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Fulfillment & Logistics Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Orders & Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Process incoming orders, assign courier partners (Blue Dart, Delhivery, DTDC), update tracking, and generate GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/track-order"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Live Customer Tracking Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, customer name, phone, city, or AWB tracking..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="text-xs text-slate-500">
            Total Matching: <strong className="text-slate-900">{filteredOrders.length}</strong> orders
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-1 overflow-x-auto pt-1 border-t border-slate-100 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? "bg-sky-50 text-[#0284C7] border border-sky-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Order Number & Date</th>
                <th className="py-3 px-3 font-semibold">Customer Details</th>
                <th className="py-3 px-3 font-semibold">Destination</th>
                <th className="py-3 px-3 font-semibold">Total Amount</th>
                <th className="py-3 px-3 font-semibold">Payment</th>
                <th className="py-3 px-3 font-semibold">Fulfillment & Courier</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-in fade-in">
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="w-28 h-4 rounded shimmer-mask"></div>
                        <div className="w-20 h-3 rounded shimmer-mask"></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1.5">
                        <div className="w-32 h-4 rounded shimmer-mask"></div>
                        <div className="w-24 h-3 rounded shimmer-mask"></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-24 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-20 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-16 h-6 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-24 h-6 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="w-14 h-6 rounded shimmer-mask ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : fetchError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-slate-600">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <span className="font-bold text-sm text-slate-800">Connection Interrupted</span>
                      <span className="text-xs text-slate-500">{fetchError}</span>
                      <button
                        onClick={fetchOrders}
                        className="mt-2 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        Retry Loading
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found for this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isDelivered = ord.orderStatus === "DELIVERED";
                  const isShipped = ord.orderStatus === "SHIPPED";
                  const isPaid = ord.paymentStatus === "PAID";

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                          {ord.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</div>
                        {ord.customerEmail && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {ord.customerEmail}
                          </div>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 font-medium">
                          {ord.city}, {ord.state}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          PIN: {ord.pincode}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {formatINR(ord.totalAmount)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {ord.items?.length || 1} item(s) &bull; incl. GST
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-700 block text-[11px]">
                          {ord.paymentMethod === "COD" ? "Cash on Delivery" : "Online Razorpay"}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase mt-0.5 ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      {/* Fulfillment & Courier */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isShipped
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                        {ord.courierName && (
                          <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                            <Truck className="w-3 h-3 text-[#0284C7] shrink-0" />
                            <span className="truncate max-w-[130px]">
                              {ord.courierName}
                            </span>
                          </div>
                        )}
                        {ord.trackingNumber && (
                          <div className="text-[10px] text-[#0284C7] font-mono font-medium">
                            AWB: {ord.trackingNumber}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Print GST Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openOrderModal(ord)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>Manage</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-5 sm:space-y-6 my-4 sm:my-8 max-h-[92vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  Order Fulfillment & Courier Dispatch
                </span>
                <h2 className="text-lg font-bold text-slate-900 font-mono">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {updateFeedback && (
              <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span className="font-semibold">{updateFeedback}</span>
              </div>
            )}

            {/* Customer & Address Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Customer Information
                </span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedOrder.customerName}
                </div>
                <div className="text-slate-700 font-mono mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedOrder.customerPhone}
                </div>
                {selectedOrder.customerEmail && (
                  <div className="text-slate-600 text-[11px] flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {selectedOrder.customerEmail}
                  </div>
                )}
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Shipping Destination
                </span>
                <div className="text-slate-700 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>{selectedOrder.shippingAddress}</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-1 pl-4">
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Order Components ({selectedOrder.items?.length || 0} items)
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Item / SKU</th>
                      <th className="py-2.5 px-2 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((it) => (
                        <tr key={it.id}>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{it.productName}</div>
                            <div className="font-mono text-[10px] text-slate-500">{it.sku}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-700">
                            {it.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                            {formatINR(it.unitPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {formatINR(it.unitPrice * it.quantity)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-400">
                          Single skid order / items grouped.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatINR(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Integrated):</span>
                  <span className="font-mono">{formatINR(selectedOrder.gstAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freight & Shipping:</span>
                  <span className="font-mono">
                    {selectedOrder.shippingFee === 0 ? "FREE" : formatINR(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-slate-200 text-sm">
                  <span>Total Amount Paid / Payable:</span>
                  <span className="font-mono text-[#0284C7]">
                    {formatINR(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateOrder} className="space-y-4 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0284C7] flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>Update Logistics, Status & Courier Partner</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="PLACED">PLACED (Order Received)</option>
                    <option value="CONFIRMED">CONFIRMED (Stock Allocated)</option>
                    <option value="PACKED">PACKED (Ready for Pickup)</option>
                    <option value="SHIPPED">SHIPPED (In Transit)</option>
                    <option value="DELIVERED">DELIVERED (Customer Handover)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="PENDING">PENDING (Awaiting settlement / COD)</option>
                    <option value="PAID">PAID (Settled via Razorpay / Cash)</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Blue Dart Express / Delhivery / DTDC"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    AWB Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BLUEDART-9876543210"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Updating syncs to customer tracking & triggers dispatch log.
                </span>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto px-5 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{updating ? "Syncing..." : "Update & Dispatch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Tax Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-4 sm:p-8 space-y-6 my-4 sm:my-8 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#0A192F] p-0.5 border border-slate-300 flex items-center justify-center relative overflow-hidden shadow-sm">
                  <Droplets className="w-4 h-4 text-[#0284C7] absolute left-1 bottom-1" />
                  <Sun className="w-4 h-4 text-[#D97706] absolute right-1 top-1" />
                </div>
                <div>
                  <div className="flex items-center leading-none">
                    <span className="text-xl font-black text-[#0284C7] tracking-tight">AQUA</span>
                    <span className="text-xl font-black text-[#D97706] tracking-tight">SOL</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    PureGrid Systems India Pvt. Ltd. &bull; Commercial RO & Solar
                  </p>
                  <p className="text-[10px] text-slate-400">
                    GSTIN: 37ABCDE1234F1Z5 &bull; CIN: U29300AP2026PTC098765
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  Tax Invoice
                </span>
                <div className="text-sm font-mono font-bold text-slate-900 mt-2">
                  {invoiceOrder.orderNumber}
                </div>
                <div className="text-xs text-slate-500">
                  Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs text-slate-700">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Billed To Customer:
                </span>
                <div className="font-bold text-sm text-slate-900 mt-1">
                  {invoiceOrder.customerName}
                </div>
                <div>Phone: {invoiceOrder.customerPhone}</div>
                {invoiceOrder.customerEmail && <div>Email: {invoiceOrder.customerEmail}</div>}
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Shipping Address:
                </span>
                <div className="mt-1">{invoiceOrder.shippingAddress}</div>
                <div>
                  {invoiceOrder.city}, {invoiceOrder.state} - {invoiceOrder.pincode}
                </div>
                <div className="mt-1 text-slate-500">
                  Payment: {invoiceOrder.paymentMethod} ({invoiceOrder.paymentStatus})
                </div>
              </div>
            </div>

            {/* Invoice Line Items */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Description & SKU</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-2 text-right">GST</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceOrder.items && invoiceOrder.items.length > 0 ? (
                    invoiceOrder.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{it.productName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{it.sku}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatINR(it.unitPrice)}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                          {it.gstPercent}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatINR(it.unitPrice * it.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-center text-slate-400">
                        Commercial order fulfillment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900">{formatINR(invoiceOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGST / CGST (18%):</span>
                  <span className="font-mono text-slate-900">{formatINR(invoiceOrder.gstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span className="font-mono text-slate-900">
                    {invoiceOrder.shippingFee === 0 ? "FREE" : formatINR(invoiceOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#0284C7]">{formatINR(invoiceOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-[10px] text-slate-400">
                This is an electronically generated tax invoice from AQUASOL PureGrid Systems Operations Console.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
