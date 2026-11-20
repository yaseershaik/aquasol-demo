"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  Droplets,
  Sun,
  ShieldCheck,
  RefreshCw,
  X,
  Send,
  MessageCircle,
  Clock,
} from "lucide-react";

interface LeadQuote {
  id: string;
  leadNumber: string;
  serviceType: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  technicalDetails: string;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Manage Lead Modal
  const [selectedLead, setSelectedLead] = useState<LeadQuote | null>(null);
  const [leadStatus, setLeadStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      let url = "/api/leads";
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (serviceFilter !== "ALL") params.append("serviceType", serviceFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load inquiries`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      } else {
        throw new Error(data.error || "Failed to load quote inquiries");
      }
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || "Failed to retrieve inquiries. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, serviceFilter]);

  const openManageModal = (l: LeadQuote) => {
    setSelectedLead(l);
    setLeadStatus(l.status);
    setAdminNotes(l.adminNotes || "");
    setFeedback(null);
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: leadStatus,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update lead");
      }

      setFeedback("Lead status and engineering notes updated successfully!");
      fetchLeads();

      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              status: leadStatus,
              adminNotes,
            }
          : null
      );
    } catch (err: any) {
      setFeedback(err.message || "Failed to update lead");
    } finally {
      setUpdating(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      l.leadNumber.toLowerCase().includes(q) ||
      l.customerName.toLowerCase().includes(q) ||
      l.customerPhone.includes(q) ||
      l.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <MessageSquareText className="w-4 h-4" />
            <span>Customer Inquiries & Estimates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Quotes & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inquiries and technical specs received from TDS Advisor, PM Surya Ghar subsidy estimator, and Contact Us forms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLeads}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Customer Contact Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quote #, customer name, phone, city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0284C7]"
          >
            <option value="ALL">All Verticals</option>
            <option value="COMMERCIAL_RO">Commercial RO</option>
            <option value="RESIDENTIAL_SOLAR">Residential Solar</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0284C7]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New (Uncontacted)</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTE_SENT">Quote Sent</option>
            <option value="WON">Won / Converted</option>
            <option value="CLOSED">Closed</option>
          </select>

          <span className="text-xs text-slate-500 pl-2">
            Showing <strong className="text-slate-900">{filteredLeads.length}</strong> inquiries
          </span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Quote # & Date</th>
                <th className="py-3 px-3 font-semibold">Vertical</th>
                <th className="py-3 px-3 font-semibold">Customer Details</th>
                <th className="py-3 px-3 font-semibold">City / Location</th>
                <th className="py-3 px-3 font-semibold">Technical Parameters</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-in fade-in">
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="w-28 h-4 rounded shimmer-mask"></div>
                        <div className="w-16 h-3 rounded shimmer-mask"></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-20 h-5 rounded shimmer-mask"></div>
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
                      <div className="w-36 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-16 h-6 rounded shimmer-mask"></div>
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
                        onClick={fetchLeads}
                        className="mt-2 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        Retry Loading
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No inquiries found for this filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => {
                  const isRo = l.serviceType === "COMMERCIAL_RO";
                  let parsedSpecs: any = {};
                  try {
                    parsedSpecs = JSON.parse(l.technicalDetails);
                  } catch {
                    parsedSpecs = { details: l.technicalDetails };
                  }

                  return (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Quote # & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                          {l.leadNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Vertical */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isRo
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isRo ? <Droplets className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                          <span>{isRo ? "Commercial RO" : "Solar PV"}</span>
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{l.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{l.customerPhone}</div>
                        {l.customerEmail && (
                          <div className="text-[10px] text-slate-400">{l.customerEmail}</div>
                        )}
                      </td>

                      {/* City */}
                      <td className="py-3.5 px-3 text-slate-800 font-medium">
                        {l.city}
                      </td>

                      {/* Technical Specs */}
                      <td className="py-3.5 px-3">
                        <div className="text-[11px] text-slate-700 max-w-[220px] truncate font-medium">
                          {parsedSpecs.capacity || parsedSpecs.systemSize || parsedSpecs.notes || l.technicalDetails}
                        </div>
                        {parsedSpecs.tds && (
                          <div className="text-[10px] text-[#0284C7] font-mono font-medium">
                            Raw Water TDS: {parsedSpecs.tds} PPM
                          </div>
                        )}
                        {parsedSpecs.bill && (
                          <div className="text-[10px] text-[#D97706] font-mono font-medium">
                            Monthly Bill: ₹{parsedSpecs.bill}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                            l.status === "WON"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : l.status === "NEW"
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200 font-bold"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <a
                            href={`https://wa.me/${l.customerPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(
                              l.customerName
                            )},%20this%20is%20AQUASOL%20PureGrid%20Systems%20regarding%20your%20quote%20request%20${
                              l.leadNumber
                            }.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => openManageModal(l)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                          >
                            Review & Quote
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

      {/* Review & Quote Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-5 sm:space-y-6 my-4 sm:my-8 shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  Customer Quote Review
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 font-mono">
                  {selectedLead.leadNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span className="font-semibold">{feedback}</span>
              </div>
            )}

            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedLead.customerName}
                  </div>
                  <div className="text-slate-600 font-mono mt-0.5">
                    {selectedLead.customerPhone}
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-[#0284C7] border border-sky-200">
                  {selectedLead.serviceType === "COMMERCIAL_RO" ? "Commercial RO" : "Solar PV"}
                </span>
              </div>

              <div className="text-slate-700 pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">
                  Location:
                </span>
                {selectedLead.city}
              </div>

              <div className="text-slate-700 pt-1">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">
                  Technical Parameters:
                </span>
                <div className="font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-1 whitespace-pre-wrap text-[11px]">
                  {selectedLead.technicalDetails}
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lead Status
                </label>
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="NEW">NEW (Awaiting review)</option>
                  <option value="CONTACTED">CONTACTED (Spoke with customer)</option>
                  <option value="QUOTE_SENT">QUOTE_SENT (Proposal emailed)</option>
                  <option value="WON">WON (Converted to Project)</option>
                  <option value="CLOSED">CLOSED (Lost / Ineligible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Engineering Notes & Follow-ups
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Recommended 1000 LPH FRP Skid with Hydranautics membrane. Customer requested quotation for 3 phase supply."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg text-center"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto px-5 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 text-center"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{updating ? "Saving..." : "Save Status"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
