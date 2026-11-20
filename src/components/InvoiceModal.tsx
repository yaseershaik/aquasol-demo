"use client";

import React, { useRef } from "react";
import { formatINR } from "@/lib/format";
import { X, Printer, ShieldCheck, Download } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  tax_percent: number;
}

interface OrderInvoiceData {
  order_number: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  pincode: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  tax_total: number;
  total_amount: number;
  items: OrderItem[];
}

interface InvoiceModalProps {
  order: OrderInvoiceData | null;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Modal Toolbar (hidden during browser print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-aqua-400">Tax Invoice</span>
            <span className="text-xs text-slate-400">#{order.order_number}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-aqua-600 hover:bg-aqua-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={printRef} className="p-8 sm:p-10 text-slate-800 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-950 tracking-tight">AQUASOL</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  PureGrid Systems
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Commercial RO Water Plants & Rooftop Solar Infrastructure<br />
                Plot 42, APIIC Industrial Park, Visakhapatnam, AP 530012<br />
                GSTIN: <span className="font-mono font-semibold text-slate-700">37AAAAA0000A1Z5</span><br />
                Support: +91 98765 43210 &bull; contact@puregridsystems.in
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Original For Recipient</span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">TAX INVOICE</h1>
              <p className="text-xs text-slate-600 font-mono mt-1">
                Invoice No: <span className="font-bold text-slate-900">INV-{order.order_number}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Date: {invoiceDate}</p>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed & Shipped To:</span>
              <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
              <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                {order.shipping_address}<br />
                PIN: {order.pincode}
              </p>
              <p className="text-slate-600 mt-1 font-mono">Mobile: {order.customer_phone}</p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Details:</span>
              <p className="text-slate-700">
                Method: <span className="font-bold text-slate-900">{order.payment_method === "ONLINE" ? "Online Payment (UPI/Card)" : "Cash on Delivery (COD)"}</span>
              </p>
              <p className="text-slate-700 mt-0.5">
                Status: <span className={`font-bold ${order.payment_status === "PAID" ? "text-emerald-700" : "text-amber-700"}`}>{order.payment_status}</span>
              </p>
              <p className="text-slate-500 mt-0.5">Place of Supply: Andhra Pradesh (37)</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6 border-b border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">GST %</th>
                  <th className="py-2.5 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {order.items.map((it, idx) => (
                  <tr key={it.id || idx}>
                    <td className="py-3 font-medium text-slate-900">{it.product_name}</td>
                    <td className="py-3 text-center font-mono">{it.quantity}</td>
                    <td className="py-3 text-right font-mono">{formatINR(it.price)}</td>
                    <td className="py-3 text-right font-mono">{it.tax_percent}%</td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-900">
                      {formatINR(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-6 flex justify-between items-start">
            <div className="max-w-xs text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Genuine OEM Warranty Backed</span>
              </div>
              <p className="leading-relaxed">
                Computer-generated invoice. Authorized and verified by PureGrid Systems. Thank you for your business!
              </p>
            </div>

            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST + SGST:</span>
                <span className="font-mono">{formatINR(order.tax_total)}</span>
              </div>
              <div className="flex justify-between text-slate-950 font-bold text-sm pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-aqua-600">{formatINR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
