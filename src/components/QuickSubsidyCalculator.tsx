"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { Sun, CheckCircle2, ArrowRight, Zap, TrendingUp, Award } from "lucide-react";

export default function QuickSubsidyCalculator() {
  const [selectedKw, setSelectedKw] = useState<number>(3);

  const solarTiers = [
    {
      kw: 2,
      label: "2 kW (1-2 BHK)",
      grossCost: 145000,
      subsidy: 60000,
      monthlySavings: 2200,
      unitsPerDay: "8 - 9 units",
      roofArea: "200 sq.ft",
    },
    {
      kw: 3,
      label: "3 kW (Popular 3 BHK)",
      grossCost: 195000,
      subsidy: 78000,
      monthlySavings: 3600,
      unitsPerDay: "12 - 14 units",
      roofArea: "320 sq.ft",
    },
    {
      kw: 5,
      label: "5 kW (Duplex / Villa)",
      grossCost: 310000,
      subsidy: 78000,
      monthlySavings: 6200,
      unitsPerDay: "20 - 24 units",
      roofArea: "500 sq.ft",
    },
    {
      kw: 10,
      label: "10 kW (High Load)",
      grossCost: 590000,
      subsidy: 78000,
      monthlySavings: 12500,
      unitsPerDay: "40 - 45 units",
      roofArea: "1,000 sq.ft",
    },
  ];

  const current = solarTiers.find((t) => t.kw === selectedKw) || solarTiers[1];
  const netCost = current.grossCost - current.subsidy;
  const annualSavings = current.monthlySavings * 12;
  const paybackYears = (netCost / annualSavings).toFixed(1);

  return (
    <div className="bg-[#FFFFFF] border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-amber-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <Award className="w-3.5 h-3.5 text-[#D97706]" /> Instant DBT Subsidy & Payback Estimator
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            PM Surya Ghar Muft Bijli Yojana Calculator
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Select your desired residential rooftop capacity to calculate direct government subsidy and return on investment.
          </p>
        </div>

        {/* Capacity Selector Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[2, 3, 5, 10].map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSelectedKw(kw)}
              className={`px-3 sm:px-4 py-2 text-xs font-black rounded-lg transition-all ${
                selectedKw === kw
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#0F172A] hover:bg-white/80"
              }`}
            >
              {kw} kW
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Turnkey Package Price
          </span>
          <p className="text-2xl font-black text-[#0F172A]">{formatINR(current.grossCost)}</p>
          <span className="text-[11px] text-slate-500 font-medium">Bifacial Panels + On-Grid Inverter</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Govt. Direct Subsidy (DBT)
          </span>
          <p className="text-2xl font-black text-[#D97706]">- {formatINR(current.subsidy)}</p>
          <span className="text-[11px] text-amber-900 font-medium">Direct Bank Transfer to Owner</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Your Effective Net Cost
          </span>
          <p className="text-2xl font-black text-emerald-800">{formatINR(netCost)}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">After Full Subsidy Credit</span>
        </div>

        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
            Est. Payback Timeline
          </span>
          <p className="text-2xl font-black text-sky-900">{paybackYears} Years</p>
          <span className="text-[11px] text-sky-700 font-semibold">Free electricity for next 21+ yrs</span>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-6 pt-5 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#D97706]" /> Daily Yield: {current.unitsPerDay}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Roof Needed: {current.roofArea}
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" /> Monthly Savings: ~{formatINR(current.monthlySavings)}
          </span>
        </div>

        <Link
          href={`/residential-solar#book-inspection`}
          className="btn-interactive w-full sm:w-auto px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-black rounded-lg transition-colors shadow-xs inline-flex items-center justify-center gap-1.5"
        >
          Book {current.kw}kW Site Feasibility Audit <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
