"use client";

import React, { useState, useEffect } from "react";
import { formatINR } from "@/lib/format";
import {
  Users,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  ExternalLink,
  RefreshCw,
  MessageCircle,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  AlertCircle,
} from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string | null;
  gstin?: string | null;
  city: string;
  state: string;
  role: string;
  isRegistered: boolean;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  recentOrders: {
    orderNumber: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const url = searchQuery.trim()
        ? `/api/customers?q=${encodeURIComponent(searchQuery.trim())}`
        : "/api/customers";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load customers`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      } else {
        throw new Error(data.error || "Failed to load customers");
      }
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || "Failed to load customer directory. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const filteredCustomers = customers.filter((c) => {
    if (roleFilter === "B2B" && c.role !== "b2b") return false;
    if (roleFilter === "CONSUMER" && c.role === "b2b") return false;
    return true;
  });

  const totalB2b = customers.filter((c) => c.role === "b2b").length;
  const totalSpendSum = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgSpend = customers.length > 0 ? totalSpendSum / customers.length : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Customer Relationship Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Accounts & Client Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of registered consumer users, enterprise B2B accounts, order histories, and lifetime value.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCustomers}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/account"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Customer Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Total Customers</span>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono">{customers.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Direct pan-India buyers</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">B2B Commercial Accounts</span>
          <div className="mt-2 text-2xl font-black text-[#0284C7] font-mono">{totalB2b}</div>
          <div className="text-[11px] text-slate-500 mt-1">With registered GSTIN & Trade details</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Customer Lifetime Value (Total)</span>
          <div className="mt-2 text-2xl font-black text-emerald-700 font-mono">{formatINR(totalSpendSum)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cumulative order volume</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Avg Spend / Customer</span>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono">{formatINR(avgSpend)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Equipment & spares average</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, email, company, city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0284C7]"
          >
            <option value="ALL">All Account Types</option>
            <option value="B2B">B2B Commercial Only</option>
            <option value="CONSUMER">Direct Consumers</option>
          </select>

          <span className="text-xs text-slate-500 pl-2">
            Showing <strong className="text-slate-900">{filteredCustomers.length}</strong> clients
          </span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Client Name & Type</th>
                <th className="py-3 px-3 font-semibold">Contact Info</th>
                <th className="py-3 px-3 font-semibold">Company / GSTIN</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Orders Count</th>
                <th className="py-3 px-3 font-semibold">Total Spend</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-in fade-in">
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="w-32 h-4 rounded shimmer-mask"></div>
                        <div className="w-16 h-3 rounded shimmer-mask"></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1.5">
                        <div className="w-24 h-4 rounded shimmer-mask"></div>
                        <div className="w-28 h-3 rounded shimmer-mask"></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-36 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-24 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-12 h-6 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-20 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="w-16 h-6 rounded shimmer-mask ml-auto"></div>
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
                        onClick={fetchCustomers}
                        className="mt-2 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        Retry Loading
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No customer accounts match your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isB2b = c.role === "b2b";

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Name & Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.isRegistered && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Registered
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                          {isB2b ? (
                            <span className="text-[#0284C7] font-bold uppercase">B2B Commercial</span>
                          ) : (
                            <span>Retail Customer</span>
                          )}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-slate-800 font-medium">{c.phone}</div>
                        {c.email && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                            {c.email}
                          </div>
                        )}
                      </td>

                      {/* Company & GSTIN */}
                      <td className="py-3.5 px-3">
                        {c.companyName ? (
                          <>
                            <div className="font-bold text-slate-900">{c.companyName}</div>
                            {c.gstin && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                GST: {c.gstin}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Individual</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 font-medium">{c.city}</div>
                        <div className="text-[10px] text-slate-500">{c.state}</div>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                        {c.totalOrders} order(s)
                      </td>

                      {/* Total Spend */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                        {formatINR(c.totalSpent)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(
                              c.name
                            )},%20this%20is%20AQUASOL%20PureGrid%20Systems.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>History</span>
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

      {/* Customer History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-5 sm:space-y-6 my-4 sm:my-8 shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  Client Profile & Purchase History
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {selectedCustomer.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Phone</span>
                  <div className="text-slate-900 font-mono font-medium">{selectedCustomer.phone}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Email</span>
                  <div className="text-slate-900 truncate font-medium">{selectedCustomer.email || "N/A"}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Company</span>
                  <div className="text-slate-900 font-bold">{selectedCustomer.companyName || "Individual Customer"}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">GSTIN</span>
                  <div className="text-slate-900 font-mono font-medium">{selectedCustomer.gstin || "N/A"}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Primary Location</span>
                <div className="text-slate-800 font-medium">{selectedCustomer.city}, {selectedCustomer.state}</div>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Past Orders ({selectedCustomer.totalOrders} total)
              </h3>
              {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {selectedCustomer.recentOrders.map((ord, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatINR(ord.totalAmount)}
                        </div>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white border border-slate-200 text-[#0284C7]">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  No previous orders recorded for this account.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-600">
                Lifetime Value: <strong className="text-emerald-700 font-mono">{formatINR(selectedCustomer.totalSpent)}</strong>
              </span>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
