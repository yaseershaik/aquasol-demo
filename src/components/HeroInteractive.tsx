"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Droplets, Sun, CheckCircle2, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";

interface HeroInteractiveProps {
  heroTitle?: string;
  heroSubtitle?: string;
}

export default function HeroInteractive({
  heroTitle = "Engineered Clean Water & Solar Energy for Homes and Enterprise",
  heroSubtitle = "Order genuine RO spare parts with live inventory across India, schedule on-site water quality audits, or deploy subsidized rooftop solar.",
}: HeroInteractiveProps) {
  const [activeVertical, setActiveVertical] = useState<"RO" | "SOLAR">("RO");

  return (
    <section className="relative bg-gradient-to-b from-[#F0F9FF]/60 via-[#FFFFFF] to-[#FFFFFF] border-b border-[#E2E8F0] pt-8 pb-14 sm:pt-14 sm:pb-20 overflow-hidden">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0A2540 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Vertical Switcher Pill */}
        <div className="flex items-center justify-center sm:justify-start mb-6">
          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs">
            <button
              type="button"
              onClick={() => setActiveVertical("RO")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeVertical === "RO"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Commercial Water</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVertical("SOLAR")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeVertical === "SOLAR"
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Rooftop Solar</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (7 Cols): Typography & Dynamic CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
              {activeVertical === "RO"
                ? "INDUSTRIAL & COMMERCIAL WATER TREATMENT"
                : "PM SURYA GHAR SUBSIDIZED SOLAR EPC"}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-[#0F172A] leading-[1.12]">
              {activeVertical === "RO" ? (
                <>
                  Precision RO Plants <span className="text-[#0284C7]">& Industrial Spares</span> Across India
                </>
              ) : (
                <>
                  Clean Rooftop Solar with <span className="text-[#D97706]">₹78,000 Govt. Subsidy</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-normal">
              {activeVertical === "RO"
                ? "Engineered multi-stage reverse osmosis units from 250 LPH to 50,000+ LPH. Factory-tested DuPont Filmtec membranes, vertical booster pumps, and 24/7 service dispatch."
                : "Complete turnkey residential on-grid solar installation. Guaranteed AP Discom net-metering approvals, Tier-1 bifacial panels, and direct-to-bank subsidy transfer."}
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {activeVertical === "RO" ? (
                <>
                  <Link
                    href="/commercial-ro"
                    className="btn-interactive px-5 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    <Droplets className="w-4 h-4 text-sky-200" /> Commercial RO Solutions
                  </Link>
                  <Link
                    href="/commercial-ro#book-inspection"
                    className="btn-interactive px-5 py-3 bg-white hover:bg-sky-50 text-[#0284C7] border border-sky-300 text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    Schedule Water Audit
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/residential-solar"
                    className="btn-interactive px-5 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    <Sun className="w-4 h-4 text-amber-200" /> Solar Rooftop Packages
                  </Link>
                  <Link
                    href="/residential-solar#book-inspection"
                    className="btn-interactive px-5 py-3 bg-white hover:bg-amber-50 text-[#D97706] border border-amber-300 text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    Book Roof Survey
                  </Link>
                </>
              )}
              <Link
                href="/products"
                className="btn-interactive px-5 py-3 bg-[#F8FAFC] hover:bg-slate-200 text-[#0F172A] border border-[#CBD5E1] text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                Spare Parts Store <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Verified Metrics Row */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-black text-[#0284C7] tracking-tight">250+</p>
                <p className="text-xs text-[#475569] font-semibold">Commercial RO Plants</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-black text-[#D97706] tracking-tight">₹78,000</p>
                <p className="text-xs text-[#475569] font-semibold">Max Govt. Subsidy</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">100%</p>
                <p className="text-xs text-[#475569] font-semibold">Genuine OEM Hardware</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">24-48h</p>
                <p className="text-xs text-[#475569] font-semibold">Fast Site Survey</p>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Dynamic Hardware Showcase Card */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden transition-all duration-300 ${
                activeVertical === "RO" ? "border-sky-200" : "border-amber-200"
              }`}
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center">
                <img
                  src={activeVertical === "RO" ? "/images/real/ro-plant-commercial.jpg" : "/images/real/solar-rooftop-array.jpg"}
                  alt={activeVertical === "RO" ? "AquaSol Commercial RO Skid Plant" : "Rooftop Solar Array"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Telemetry Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0A192F]/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 flex items-center justify-between text-white text-xs">
                  {activeVertical === "RO" ? (
                    <>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold block">Live Telemetry</span>
                        <span className="font-bold text-slate-100">Permeate TDS: 38 ppm</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">Capacity</span>
                        <span className="font-bold text-slate-100">1,000 LPH Skid</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">AP Discom Meter</span>
                        <span className="font-bold text-slate-100">Net Export: Active</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">DBT Subsidy</span>
                        <span className="font-bold text-slate-100">₹78,000 Direct</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className={`flex items-center gap-1.5 ${activeVertical === "RO" ? "text-[#0284C7]" : "text-[#D97706]"}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {activeVertical === "RO" ? "Multi-Stage SS-304 Pre-Treatment" : "Tier-1 Dual-Glass Bifacial Panels"}
                </span>
                <Link
                  href={activeVertical === "RO" ? "/commercial-ro" : "/residential-solar"}
                  className={`hover:underline ${activeVertical === "RO" ? "text-[#0284C7]" : "text-[#D97706]"}`}
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Quick Switch Helper */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">
                Switch vertical to explore:
              </span>
              <button
                type="button"
                onClick={() => setActiveVertical(activeVertical === "RO" ? "SOLAR" : "RO")}
                className="font-bold text-[#0284C7] hover:underline"
              >
                {activeVertical === "RO" ? "Explore Solar Solutions →" : "Explore Water Plants →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
