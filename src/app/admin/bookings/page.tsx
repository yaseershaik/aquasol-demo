"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  Calendar,
  Clock,
  User,
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
} from "lucide-react";

interface Booking {
  id: string;
  bookingNumber: string;
  serviceType: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  address: string;
  city: string;
  pincode: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string | null;
  assignedTech?: string | null;
  status: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Manage / Assign modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [assignedTech, setAssignedTech] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const technicians = [
    "Ramesh V. (Senior Water Engineer)",
    "Karthik R. (Solar PV Specialist)",
    "S. Rao (Commercial Skid Lead)",
    "Anand K. (Field Surveyor)",
    "Suresh Babu (Solar Grid Surveyor)",
    "P. Naidu (Regional Tech Lead)",
  ];

  const fetchBookings = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const url = statusFilter !== "ALL" ? `/api/bookings?status=${statusFilter}` : "/api/bookings";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load bookings`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        throw new Error(data.error || "Failed to load bookings");
      }
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || "Failed to load survey bookings. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const openManageModal = (b: Booking) => {
    setSelectedBooking(b);
    setAssignedTech(b.assignedTech || technicians[0]);
    setBookingStatus(b.status);
    setPreferredDate(b.preferredDate);
    setTimeSlot(b.timeSlot);
    setNotes(b.notes || "");
    setFeedback(null);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedTech: assignedTech.trim() || null,
          status: bookingStatus,
          preferredDate,
          timeSlot,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update survey");
      }

      setFeedback("Technician assigned and survey status updated! Customer SMS alert dispatched.");
      fetchBookings();

      setSelectedBooking((prev) =>
        prev
          ? {
              ...prev,
              assignedTech: assignedTech.trim() || null,
              status: bookingStatus,
              preferredDate,
              timeSlot,
              notes,
            }
          : null
      );
    } catch (err: any) {
      setFeedback(err.message || "Failed to update survey booking");
    } finally {
      setUpdating(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (serviceFilter !== "ALL" && b.serviceType !== serviceFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.bookingNumber.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.includes(q) ||
      b.city.toLowerCase().includes(q) ||
      (b.assignedTech && b.assignedTech.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <CalendarCheck2 className="w-4 h-4" />
            <span>Field Engineering Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Site Surveys & Field Inspections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign certified engineers for Commercial RO plant sizing and Residential Solar rooftop shadow analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBookings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Refresh Bookings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/commercial-ro"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Customer Booking Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by survey #, customer name, phone, city, or technician..."
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
            <option value="ALL">All Services</option>
            <option value="COMMERCIAL_RO">Commercial RO Skids</option>
            <option value="RESIDENTIAL_SOLAR">Residential Solar</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0284C7]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending (Unassigned)</option>
            <option value="CONFIRMED">Confirmed / Assigned</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <span className="text-xs text-slate-500 pl-2">
            Showing <strong className="text-slate-900">{filteredBookings.length}</strong> inspections
          </span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Survey # & Date</th>
                <th className="py-3 px-3 font-semibold">Service Type</th>
                <th className="py-3 px-3 font-semibold">Customer Details</th>
                <th className="py-3 px-3 font-semibold">Site Address</th>
                <th className="py-3 px-3 font-semibold">Scheduled Window</th>
                <th className="py-3 px-3 font-semibold">Assigned Tech</th>
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
                      <div className="w-36 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="w-24 h-3.5 rounded shimmer-mask"></div>
                        <div className="w-20 h-3 rounded shimmer-mask"></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-28 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-16 h-6 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="w-20 h-6 rounded shimmer-mask ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : fetchError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-slate-600">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <span className="font-bold text-sm text-slate-800">Connection Interrupted</span>
                      <span className="text-xs text-slate-500">{fetchError}</span>
                      <button
                        onClick={fetchBookings}
                        className="mt-2 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        Retry Loading
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No site inspections match your filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isRo = b.serviceType === "COMMERCIAL_RO";
                  const isCompleted = b.status === "COMPLETED";
                  const isConfirmed = b.status === "CONFIRMED";

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Survey # & Created Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                          {b.bookingNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Service Type */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isRo
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isRo ? <Droplets className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                          <span>{isRo ? "Commercial RO" : "Rooftop Solar"}</span>
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{b.customerPhone}</div>
                      </td>

                      {/* Site Address */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 truncate max-w-[170px]" title={b.address}>
                          {b.address}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {b.city} - {b.pincode}
                        </div>
                      </td>

                      {/* Scheduled Window */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-slate-800 font-medium">
                          {b.preferredDate}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {b.timeSlot}
                        </div>
                      </td>

                      {/* Assigned Tech */}
                      <td className="py-3.5 px-3">
                        {b.assignedTech ? (
                          <div className="text-slate-800 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                            <span className="truncate max-w-[140px]">{b.assignedTech}</span>
                          </div>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isConfirmed
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <a
                            href={`https://wa.me/${b.customerPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(
                              b.customerName
                            )},%20this%20is%20AQUASOL%20PureGrid%20Systems%20regarding%20your%20site%20inspection%20request%20${
                              b.bookingNumber
                            }.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => openManageModal(b)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                          >
                            Assign / Manage
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

      {/* Manage Survey / Assign Technician Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-5 sm:space-y-6 my-4 sm:my-8 shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  Site Survey Dispatch
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 font-mono">
                  {selectedBooking.bookingNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
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

            {/* Customer Details Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedBooking.customerName}
                  </div>
                  <div className="text-slate-600 font-mono mt-0.5">
                    {selectedBooking.customerPhone}
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-[#0284C7] border border-sky-200">
                  {selectedBooking.serviceType === "COMMERCIAL_RO" ? "Commercial RO" : "Solar PV"}
                </span>
              </div>

              <div className="text-slate-700 pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">
                  Inspection Address:
                </span>
                {selectedBooking.address}, {selectedBooking.city} - {selectedBooking.pincode}
              </div>

              {selectedBooking.notes && (
                <div className="text-slate-600 pt-1 text-[11px] italic">
                  &quot;{selectedBooking.notes}&quot;
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Certified Field Engineer
                </label>
                <select
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="">-- Select Field Technician --</option>
                  {technicians.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 04:00 PM">12:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Survey Workflow Status
                </label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="PENDING">PENDING (New Customer Lead)</option>
                  <option value="CONFIRMED">CONFIRMED (Engineer Dispatched)</option>
                  <option value="COMPLETED">COMPLETED (Site Sizing Done)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
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
                  <span>{updating ? "Saving..." : "Confirm & Dispatch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
