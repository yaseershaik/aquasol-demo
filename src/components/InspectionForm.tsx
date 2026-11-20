"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from "lucide-react";
import { getStoredUser, UserProfile } from "@/lib/user-auth";

interface InspectionFormProps {
  defaultVertical?: "COMMERCIAL_RO" | "RESIDENTIAL_SOLAR";
}

export default function InspectionForm({
  defaultVertical = "COMMERCIAL_RO",
}: InspectionFormProps) {
  const [serviceType, setServiceType] = useState<"COMMERCIAL_RO" | "RESIDENTIAL_SOLAR">(
    defaultVertical
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 12:00 PM");
  const [notes, setNotes] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
    const user = getStoredUser();
    if (user) {
      setLoggedInUser(user);
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.pincode) setPincode(user.pincode);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) {
      setErrorMsg("You must be signed in to your account to schedule an inspection.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aquasol_user_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let res = await fetch("/api/bookings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: customerEmail.trim() || "customer@aquasol.com",
          vertical: serviceType,
          preferred_date: preferredDate,
          preferred_time_slot: timeSlot,
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      if (res.status === 404) {
        res = await fetch("/api/py/bookings", {
          method: "POST",
          headers,
          body: JSON.stringify({
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim(),
            customer_email: customerEmail.trim() || "customer@aquasol.com",
            vertical: serviceType,
            preferred_date: preferredDate,
            preferred_time_slot: timeSlot,
            address: address.trim(),
            city: city.trim(),
            pincode: pincode.trim(),
            notes: notes.trim() || undefined,
          }),
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || "Failed to schedule booking. Please try again.");
      }

      const data = await res.json();
      setBookingResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (bookingResult) {
    return (
      <div className="bg-[#FFFFFF] border border-[#0A0A0A] p-6 sm:p-8 rounded space-y-4 text-[#0A0A0A]">
        <div className="flex items-center gap-2 text-[#166534]">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <h3 className="text-xl font-bold">Site Inspection Booked</h3>
        </div>

        <p className="text-sm text-[#525252]">
          Your inspection request has been logged in our engineering schedule. A technical coordinator will review site access and call you before arrival.
        </p>

        <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-4 rounded space-y-2 text-sm">
          <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-[#525252]">Booking Reference:</span>
            <span className="font-mono font-bold text-[#0A0A0A]">{bookingResult.booking_reference || bookingResult.bookingNumber}</span>
          </div>
          <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-[#525252]">Vertical:</span>
            <span className="font-medium">
              {(bookingResult.vertical || bookingResult.serviceType) === "COMMERCIAL_RO" ? "Commercial RO Plant" : "Residential Rooftop Solar"}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-[#525252]">Scheduled Date:</span>
            <span className="font-medium">
              {bookingResult.preferred_date || bookingResult.preferredDate} ({bookingResult.preferred_time_slot || bookingResult.timeSlot})
            </span>
          </div>
          <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-[#525252]">Assigned Field Engineer:</span>
            <span className="font-semibold text-emerald-800">
              {bookingResult.assigned_technician || "Er. P. Ramachandra (Lead Field Engineer)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#525252]">Site Address:</span>
            <span className="font-medium text-right max-w-xs">{bookingResult.address} - {bookingResult.pincode}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/track-order?ref=${bookingResult.booking_reference || bookingResult.bookingNumber}&phone=${bookingResult.customer_phone || bookingResult.customerPhone}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0A0A0A] text-[#FFFFFF] text-sm font-medium rounded hover:bg-[#262626]"
          >
            Track Booking Status <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setBookingResult(null);
              setCustomerName("");
              setCustomerPhone("");
              setCustomerEmail("");
              setAddress("");
              setCity("");
              setPincode("");
              setPreferredDate("");
              setNotes("");
            }}
            className="px-4 py-2.5 border border-[#E5E5E5] text-[#0A0A0A] text-sm font-medium rounded hover:bg-[#F9F9F9]"
          >
            Schedule Another Inspection
          </button>
        </div>
      </div>
    );
  }

  if (mounted && !loggedInUser) {
    return (
      <div className="bg-[#FFFFFF] border border-sky-200 p-8 rounded-2xl shadow-xs text-center space-y-5">
        <div className="w-14 h-14 bg-sky-50 text-[#0284C7] rounded-2xl flex items-center justify-center mx-auto border border-sky-100 shadow-xs">
          <Calendar className="w-7 h-7 stroke-[1.75]" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-[#0284C7] border border-sky-200">
            Account Required
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Schedule an On-Site Inspection
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Booking an on-site water quality test or rooftop solar feasibility inspection requires an active customer account. This allows our dispatch operations to verify your site address, assign a certified regional technician, and provide you with instant inspection tracking.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/login?redirect=/commercial-ro#book-inspection"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In to Book Inspection</span>
          </Link>
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E5E5E5] p-6 sm:p-8 rounded space-y-5">
      <div>
        <h3 className="text-xl font-bold text-[#0A0A0A]">Schedule an On-Site Inspection</h3>
        <p className="text-xs text-[#525252] mt-1">
          Our certified engineers evaluate water source chemistry, plumbing flow rates, or rooftop structural sunlight viability.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Vertical Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252]">
          Select Inspection Service
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setServiceType("COMMERCIAL_RO")}
            className={`p-3 text-left border rounded-lg text-xs transition-colors ${
              serviceType === "COMMERCIAL_RO"
                ? "border-[#0284C7] bg-[#0284C7] text-[#FFFFFF] font-bold shadow-xs"
                : "border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            Commercial RO Water Plant
            <span className={`block text-[11px] mt-0.5 font-normal ${serviceType === "COMMERCIAL_RO" ? "text-sky-100" : "text-slate-500"}`}>
              Raw water test, flow analysis & pump sizing
            </span>
          </button>

          <button
            type="button"
            onClick={() => setServiceType("RESIDENTIAL_SOLAR")}
            className={`p-3 text-left border rounded-lg text-xs transition-colors ${
              serviceType === "RESIDENTIAL_SOLAR"
                ? "border-[#D97706] bg-[#D97706] text-[#FFFFFF] font-bold shadow-xs"
                : "border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            Residential Rooftop Solar
            <span className={`block text-[11px] mt-0.5 font-normal ${serviceType === "RESIDENTIAL_SOLAR" ? "text-amber-100" : "text-slate-500"}`}>
              Roof azimuth, shadow profiling & DISCOM load
            </span>
          </button>
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
            Contact Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Ramesh Reddy"
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
          Email Address (Optional)
        </label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="e.g. ramesh@company.com"
          className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
        />
      </div>

      {/* Address & City */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
          Site Full Address *
        </label>
        <textarea
          required
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Building name, street, industrial zone or landmark"
          className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
            City / Town *
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Vijayawada, Guntur, Hyderabad"
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

      {/* Date & Time Slot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Preferred Date *
          </label>
          <input
            type="date"
            required
            min={minDate}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Preferred Time Window *
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
          >
            <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning)</option>
            <option value="12:00 PM - 04:00 PM">12:00 PM - 04:00 PM (Afternoon)</option>
            <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM (Evening)</option>
          </select>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
          Technical Notes / Specific Requirements (Optional)
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            serviceType === "COMMERCIAL_RO"
              ? "e.g. Borewell water tastes salty, existing pump 3HP, high hardness"
              : "e.g. 3-phase connection, 1200 sq ft concrete roof, 4kW sanctioned load"
          }
          className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-interactive w-full py-3 text-[#FFFFFF] text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 ${
          serviceType === "COMMERCIAL_RO"
            ? "bg-[#0284C7] hover:bg-[#0369A1]"
            : "bg-[#D97706] hover:bg-[#B45309]"
        }`}
      >
        {loading ? "Registering Inspection Schedule..." : "Confirm Site Inspection Booking"}
      </button>

      <p className="text-[11px] text-center text-[#737373]">
        Zero upfront fees. Inspection report and custom proposal delivered within 24 hours of site visit.
      </p>
    </form>
  );
}
