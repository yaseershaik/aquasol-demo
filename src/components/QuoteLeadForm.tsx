"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, CheckCircle2, AlertCircle, FileText, ArrowRight, UserCheck } from "lucide-react";
import { getStoredUser, UserProfile } from "@/lib/user-auth";

interface QuoteLeadFormProps {
  vertical: "COMMERCIAL_RO" | "RESIDENTIAL_SOLAR";
}

export default function QuoteLeadForm({ vertical }: QuoteLeadFormProps) {
  // RO Fields
  const [capacityLPH, setCapacityLPH] = useState("1,000 LPH (Commercial Standard)");
  const [waterSource, setWaterSource] = useState("Borewell Ground Water");
  const [rawTds, setRawTds] = useState("500 - 1,500 ppm (Moderate Hardness)");
  const [application, setApplication] = useState("Factory / Manufacturing Unit");

  // Solar Fields
  const [monthlyBill, setMonthlyBill] = useState("₹3,000 - ₹6,000 per month");
  const [roofArea, setRoofArea] = useState("400 - 800 sq. ft. (Adequate for 3-5 kW)");
  const [roofType, setRoofType] = useState("Flat RCC Concrete Roof");
  const [subsidyAssistance, setSubsidyAssistance] = useState("Yes (PM Surya Ghar ₹78,000 Subsidy)");

  // Common Contact
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [leadResult, setLeadResult] = useState<any | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setLoggedInUser(user);
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
      if (user.city) setCity(user.city);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const technicalDetails =
      vertical === "COMMERCIAL_RO"
        ? {
            capacityLPH,
            waterSource,
            rawTds,
            application,
            notes: additionalNotes,
          }
        : {
            monthlyBill,
            roofArea,
            roofType,
            subsidyAssistance,
            notes: additionalNotes,
          };

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aquasol_user_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let res = await fetch("/api/leads", {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: customerEmail.trim() || undefined,
          vertical,
          city: city.trim(),
          technical_details: technicalDetails,
        }),
      });

      if (res.status === 404) {
        res = await fetch("/api/py/leads", {
          method: "POST",
          headers,
          body: JSON.stringify({
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim(),
            customer_email: customerEmail.trim() || undefined,
            vertical,
            city: city.trim(),
            technical_details: technicalDetails,
          }),
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || "Failed to submit quote request.");
      }

      const data = await res.json();
      setLeadResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (leadResult) {
    return (
      <div className="bg-[#FFFFFF] border border-[#0A0A0A] p-6 sm:p-8 rounded space-y-4 text-[#0A0A0A]">
        <div className="flex items-center gap-2 text-[#166534]">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <h3 className="text-xl font-bold">Quotation Estimate Registered</h3>
        </div>

        <p className="text-sm text-[#525252]">
          Our technical proposal desk has received your specifications. A detailed bill of materials and payback estimate will be shared via WhatsApp and email within 2 business hours.
        </p>

        <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-4 rounded space-y-2 text-sm">
          <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-[#525252]">Quote Reference:</span>
            <span className="font-mono font-bold text-[#0A0A0A]">{leadResult.lead_reference || leadResult.leadNumber}</span>
          </div>
          <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-[#525252]">Vertical:</span>
            <span className="font-medium">
              {vertical === "COMMERCIAL_RO" ? "Industrial/Commercial RO Plant" : "Rooftop Solar EPC"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#525252]">Client Location:</span>
            <span className="font-medium">{leadResult.city}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setLeadResult(null);
              setCustomerName("");
              setCustomerPhone("");
              setCustomerEmail("");
              setCity("");
              setAdditionalNotes("");
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0A0A0A] text-[#FFFFFF] text-sm font-medium rounded hover:bg-[#262626]"
          >
            Submit Another Technical Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E5E5E5] p-6 sm:p-8 rounded space-y-5">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F5] text-[#0A0A0A] rounded text-xs font-semibold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          Instant Cost & Sizing Proposal
        </div>
        <h3 className="text-xl font-bold text-[#0A0A0A]">
          {vertical === "COMMERCIAL_RO"
            ? "Request Commercial RO Plant Proposal"
            : "Request Residential Solar Feasibility & Quote"}
        </h3>
        <p className="text-xs text-[#525252] mt-1">
          Provide your baseline parameters below. Our project engineers evaluate pump pressure stages, membrane counts, or inverter ratings.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Vertical Specific Fields */}
      {vertical === "COMMERCIAL_RO" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Target Capacity (Liters Per Hour) *
              </label>
              <select
                value={capacityLPH}
                onChange={(e) => setCapacityLPH(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="250 LPH (Small Clinic / Cafe / Office)">250 LPH (Small Clinic / Cafe / Office)</option>
                <option value="500 LPH (School / Restaurant / Small Hotel)">500 LPH (School / Restaurant / Small Hotel)</option>
                <option value="1,000 LPH (Commercial Standard / Apartment)">1,000 LPH (Commercial Standard / Apartment)</option>
                <option value="2,000 LPH (Industrial / Heavy Usage)">2,000 LPH (Industrial / Heavy Usage)</option>
                <option value="5,000+ LPH (Bottling / Factory Process)">5,000+ LPH (Bottling / Factory Process)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Raw Water Source *
              </label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="Borewell Ground Water">Borewell Ground Water</option>
                <option value="Municipal / Corporation Supply">Municipal / Corporation Supply</option>
                <option value="Water Tanker Supplies">Water Tanker Supplies</option>
                <option value="Canal / Open Lake Source">Canal / Open Lake Source</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Estimated Raw Water TDS (ppm) *
              </label>
              <select
                value={rawTds}
                onChange={(e) => setRawTds(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="Under 500 ppm (Mild Salinity)">Under 500 ppm (Mild Salinity)</option>
                <option value="500 - 1,500 ppm (Moderate Hardness)">500 - 1,500 ppm (Moderate Hardness)</option>
                <option value="1,500 - 3,000 ppm (High Salinity / Brackish)">1,500 - 3,000 ppm (High Salinity / Brackish)</option>
                <option value="3,000+ ppm (Severe Brackish / Industrial)">3,000+ ppm (Severe Brackish / Industrial)</option>
                <option value="Don't Know - Request Lab Sample Pickup">Don&apos;t Know - Request Lab Sample Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Premise / Application Type *
              </label>
              <select
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="Factory / Manufacturing Unit">Factory / Manufacturing Unit</option>
                <option value="Hospital / Healthcare Center">Hospital / Healthcare Center</option>
                <option value="Educational Institution">Educational Institution</option>
                <option value="Packaged Drinking Water Plant">Packaged Drinking Water Plant</option>
                <option value="Hotel / Commercial Complex">Hotel / Commercial Complex</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Average Monthly Power Bill *
              </label>
              <select
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="₹1,500 - ₹3,000 per month (Ideal for 2-3 kW)">₹1,500 - ₹3,000 per month (Ideal for 2-3 kW)</option>
                <option value="₹3,000 - ₹6,000 per month (Ideal for 3-5 kW)">₹3,000 - ₹6,000 per month (Ideal for 3-5 kW)</option>
                <option value="₹6,000 - ₹12,000 per month (Ideal for 5-8 kW)">₹6,000 - ₹12,000 per month (Ideal for 5-8 kW)</option>
                <option value="₹12,000+ per month (10 kW+ High Load)">₹12,000+ per month (10 kW+ High Load)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Rooftop Shadow-Free Area *
              </label>
              <select
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="200 - 400 sq. ft. (Fits up to 2-3 kW)">200 - 400 sq. ft. (Fits up to 2-3 kW)</option>
                <option value="400 - 800 sq. ft. (Adequate for 3-5 kW)">400 - 800 sq. ft. (Adequate for 3-5 kW)</option>
                <option value="800 - 1,500 sq. ft. (Adequate for 5-10 kW)">800 - 1,500 sq. ft. (Adequate for 5-10 kW)</option>
                <option value="1,500+ sq. ft. (Large Independent Roof)">1,500+ sq. ft. (Large Independent Roof)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                Roof Surface Structure *
              </label>
              <select
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="Flat RCC Concrete Roof">Flat RCC Concrete Roof</option>
                <option value="Industrial Tin / Profile Sheet">Industrial Tin / Profile Sheet</option>
                <option value="Slanted Clay / Mangalore Tile">Slanted Clay / Mangalore Tile</option>
                <option value="Elevated Superstructure Needed">Elevated Superstructure Needed (Ground Clearance)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
                PM Surya Ghar Subsidy Assistance *
              </label>
              <select
                value={subsidyAssistance}
                onChange={(e) => setSubsidyAssistance(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="Yes (PM Surya Ghar ₹78,000 Subsidy)">Yes (Include ₹78,000 Direct Subsidy Assistance)</option>
                <option value="No (Commercial / Non-Subsidized Tariff)">No (Commercial / Non-Subsidized Tariff)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Customer Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E5E5]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Anand Sharma"
            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
            Contact Number *
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
            Email (For Written Quote Delivery)
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="e.g. anand@example.com"
            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
            City / District *
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Vijayawada, Guntur, Vizag"
            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">
          Special Notes or Specific Brand Preferences (Optional)
        </label>
        <input
          type="text"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="e.g. Prefer Grundfos pumps / Microinverters / need fast turnaround"
          className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#0A0A0A]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-interactive w-full py-3.5 text-[#FFFFFF] text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 ${
          vertical === "COMMERCIAL_RO"
            ? "bg-[#0284C7] hover:bg-[#0369A1]"
            : "bg-[#D97706] hover:bg-[#B45309]"
        }`}
      >
        {loading ? "Generating Engineering Estimate..." : "Submit for Custom Engineering Proposal"}
      </button>

      <p className="text-[11px] text-center text-[#737373]">
        We respect your privacy. Technical estimates include comprehensive component pricing, warranty terms, and projected energy/water output.
      </p>
    </form>
  );
}
