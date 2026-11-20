"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Droplets, CheckCircle2, ArrowRight, Gauge, Activity, ShieldCheck } from "lucide-react";

export default function WaterTdsAdvisor() {
  const [feedTds, setFeedTds] = useState<number>(1800);

  const getTdsTier = (tds: number) => {
    if (tds <= 800) {
      return {
        level: "Moderate Municipal / Shallow Borewell",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        badge: "Low to Moderate Hardness",
        recoveryRate: "70% - 75%",
        permeateTds: "18 - 35 ppm",
        recommendedPretreatment: "10-Micron Spun Sediment + Dual Media Sand/Carbon FRP Vessel",
        membraneType: "Standard Brackish Water (BW30-4040 Low Energy)",
        foulingRisk: "Low",
      };
    } else if (tds <= 2500) {
      return {
        level: "Commercial Borewell Groundwater",
        color: "text-sky-700 bg-sky-50 border-sky-200",
        badge: "High Dissolved Solids & Silica",
        recoveryRate: "65% - 70%",
        permeateTds: "30 - 55 ppm",
        recommendedPretreatment: "Sand/Carbon Vessel + Antiscalant Chemical Dosing Pump (Prominent)",
        membraneType: "High-Rejection DuPont Filmtec BW30-4040 (99.5% rejection)",
        foulingRisk: "Moderate (Antiscalant prevents gypsum scaling)",
      };
    } else {
      return {
        level: "Severe Industrial / Coastal Brackish Aquifer",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        badge: "Severe Salinity & Hardness",
        recoveryRate: "50% - 60%",
        permeateTds: "45 - 75 ppm",
        recommendedPretreatment: "Multi-Grade Sand + Activated Carbon + Dual Stage Dosing + Micron Cartridge",
        membraneType: "Toray TM720D-400 High Surface Area or Dow Brackish Extra High Pressure",
        foulingRisk: "High (Requires Automated High-Pressure Flushes)",
      };
    }
  };

  const currentTier = getTdsTier(feedTds);

  return (
    <div className="bg-[#FFFFFF] border border-sky-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sky-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-sky-200">
            <Gauge className="w-3.5 h-3.5 text-[#0284C7]" /> Interactive Water Chemistry Advisor
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Raw Borewell TDS & Membrane Selection Guide
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Slide your site raw water TDS to see engineered pre-treatment requirements and expected pure water output.
          </p>
        </div>

        {/* Preset TDS Quick Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[500, 1200, 2200, 3800].map((tdsVal) => (
            <button
              key={tdsVal}
              type="button"
              onClick={() => setFeedTds(tdsVal)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                feedTds === tdsVal
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#0F172A] hover:bg-white/80"
              }`}
            >
              {tdsVal} ppm
            </button>
          ))}
        </div>
      </div>

      {/* Slider Control */}
      <div className="py-6 border-b border-sky-100 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Current Raw Water TDS Level:
          </label>
          <span className="text-xl font-black font-mono text-[#0284C7]">
            {feedTds} PPM <span className="text-xs text-slate-500 font-normal">(mg/L)</span>
          </span>
        </div>
        <input
          type="range"
          min="300"
          max="4500"
          step="50"
          value={feedTds}
          onChange={(e) => setFeedTds(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>300 ppm (Drinking Standard)</span>
          <span>1,500 ppm (Average Ground)</span>
          <span>3,000 ppm (High Salinity)</span>
          <span>4,500 ppm (Severe Coastal)</span>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Water Hardness Category
          </span>
          <p className="text-base font-black text-[#0F172A]">{currentTier.badge}</p>
          <span className="text-[11px] text-slate-500 font-medium">{currentTier.level}</span>
        </div>

        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
            Permeate Output TDS
          </span>
          <p className="text-2xl font-black text-[#0284C7]">{currentTier.permeateTds}</p>
          <span className="text-[11px] text-sky-700 font-medium">99%+ Mineral Rejection</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Expected Recovery Rate
          </span>
          <p className="text-2xl font-black text-[#0F172A]">{currentTier.recoveryRate}</p>
          <span className="text-[11px] text-slate-500 font-medium">Clean Permeate Ratio</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Pre-Treatment Strategy
          </span>
          <p className="text-xs font-bold text-emerald-950 line-clamp-2">
            {currentTier.recommendedPretreatment}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block">Protects RO Membrane Life</span>
        </div>
      </div>

      {/* Bottom Technical Spec & Action CTA */}
      <div className="mt-6 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-[#0284C7] shrink-0" />
          <span>
            Recommended Membrane: <strong className="text-[#0F172A]">{currentTier.membraneType}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/commercial-ro#book-inspection"
            className="btn-interactive flex-1 sm:flex-none px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg transition inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            Schedule Water Quality Audit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/products?vertical=RO"
            className="btn-interactive flex-1 sm:flex-none px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition text-center"
          >
            Order RO Spares
          </Link>
        </div>
      </div>
    </div>
  );
}
