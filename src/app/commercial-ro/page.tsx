import React from "react";
import Link from "next/link";
import InspectionForm from "@/components/InspectionForm";
import QuoteLeadForm from "@/components/QuoteLeadForm";
import WaterTdsAdvisor from "@/components/WaterTdsAdvisor";
import {
  Droplets,
  CheckCircle2,
  Shield,
  Wrench,
  Layers,
  ArrowRight,
  Gauge,
  Factory,
  Building,
  GraduationCap,
} from "lucide-react";

export const metadata = {
  title: "Commercial RO Water Plants (250 - 50,000+ LPH) | AquaSol Systems",
  description:
    "Engineered commercial and industrial reverse osmosis water treatment plants by AquaSol. Turnkey installations, high-pressure multistage pumps, Dow Filmtec membranes, and AMC maintenance.",
};

export default function CommercialRoPage() {
  const capacities = [
    {
      size: "250 - 500 LPH",
      bestFor: "Clinics, Cafes, Small Offices (50-200 people)",
      pumps: "0.75 - 1.5 HP Multistage",
      membranes: "1x 4040 TFC",
      footprint: "15 sq. ft.",
    },
    {
      size: "1,000 - 2,000 LPH",
      bestFor: "Schools, Colleges, Restaurants, 100-Flat Apartments",
      pumps: "2.0 - 3.0 HP High Head Pump",
      membranes: "2x - 4x 4040 TFC Elements",
      footprint: "30 sq. ft.",
    },
    {
      size: "3,000 - 5,000 LPH",
      bestFor: "Hospitals, Dairies, Food Processing Units",
      pumps: "5.0 HP Vertical Multistage",
      membranes: "2x - 4x 8040 Industrial Elements",
      footprint: "60 sq. ft.",
    },
    {
      size: "10,000 - 50,000+ LPH",
      bestFor: "Packaged Drinking Water Plants, Heavy Industry, Boilers",
      pumps: "10 - 25 HP Heavy Duty High-Pressure System",
      membranes: "Multi-array 8040 Skid Architecture",
      footprint: "Custom Skid Layout",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F0F9FF]/70 via-[#FFFFFF] to-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-bold uppercase tracking-wider text-sky-900">
              <Droplets className="w-3.5 h-3.5 text-[#0284C7]" />
              AQUASOL • Commercial Water Purification Engineering
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Commercial & Industrial RO Plants (250 to 50,000+ LPH)
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              We design, fabricate, and commission high-performance reverse osmosis plants tailored to your raw water chemistry. 
              Equipped with food-grade stainless steel skids, automatic backwash valves, and high-rejection Dow Filmtec / Hydranautics membranes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#book-inspection"
                className="btn-interactive px-5 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-[#FFFFFF] text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Schedule Site Water Audit
              </a>
              <a
                href="#custom-quote"
                className="btn-interactive px-5 py-3 border border-[#0284C7] text-[#0284C7] hover:bg-sky-50 text-sm font-semibold rounded-lg transition-colors"
              >
                Request Custom Plant Quotation
              </a>
              <Link
                href="/products?vertical=RO"
                className="btn-interactive px-5 py-3 bg-[#F8FAFC] hover:bg-slate-200 text-[#0F172A] border border-[#CBD5E1] text-sm font-semibold rounded-lg transition-colors"
              >
                Order Genuine RO Spares
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Capacity Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-b border-[#E2E8F0] pb-4 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0284C7] mb-1">
            <Gauge className="w-3.5 h-3.5" /> Capacity Sizing Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Engineered Plant Capacities
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Choose standard skid sizes or speak with our water process engineers for customized multi-stage systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capacities.map((cap, idx) => (
            <div
              key={idx}
              className="hover-lift bg-[#FFFFFF] border border-sky-100 hover:border-[#0284C7] rounded-xl p-6 flex flex-col justify-between shadow-xs transition-all"
            >
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 inline-block">
                  Capacity Tier 0{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-[#0F172A]">{cap.size}</h3>
                <p className="text-xs text-[#475569]">
                  <strong className="text-[#0F172A]">Application:</strong> {cap.bestFor}
                </p>

                <div className="pt-3 border-t border-sky-100 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Pumps:</span>
                    <p className="font-bold text-[#0F172A]">{cap.pumps}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Membranes:</span>
                    <p className="font-bold text-[#0F172A]">{cap.membranes}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Floor Space:</span>
                    <p className="font-bold text-[#0F172A]">{cap.footprint}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-sky-100">
                <a
                  href="#custom-quote"
                  className="w-full inline-flex items-center justify-center py-2.5 px-3 bg-[#0284C7] hover:bg-[#0369A1] text-[#FFFFFF] text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Request Sizing Proposal
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6-Stage Water Purification Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#F0F9FF] to-[#FFFFFF] border border-sky-200 rounded-2xl p-8 sm:p-12 space-y-8 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0284C7] mb-1">
              <Layers className="w-3.5 h-3.5" /> Engineering Flow
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              AquaSol 6-Stage Industrial Water Purification
            </h2>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl">
              Industrial grade pre-treatment ensures maximum membrane life, minimal antiscalant consumption, and consistent permeate TDS under 50 ppm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] border border-sky-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#0284C7]">01 / PRE-TREATMENT</span>
              <h3 className="text-base font-bold text-[#0F172A]">Dual Media Sand Filter</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Removes suspended solids, turbidity, and physical particles down to 30 microns using graded silica quartz and gravel layers.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-sky-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#0284C7]">02 / DE-CHLORINATION</span>
              <h3 className="text-base font-bold text-[#0F172A]">Activated Carbon Filter</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Adsorbs free chlorine, organic contaminants, odor, and color to safeguard sensitive composite membranes from chemical oxidation.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-sky-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#0284C7]">03 / ANTISCALANT DOSING</span>
              <h3 className="text-base font-bold text-[#0F172A]">Chemical Dosing System</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Electronic diaphragm dosing pump introduces certified antiscalant agent to prevent calcium and magnesium scale formation.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-sky-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#0284C7]">04 / POLISHING MICRON</span>
              <h3 className="text-base font-bold text-[#0F172A]">5-Micron Spun Cartridges</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Precision wound PP cartridge filters trap any residual fine particles prior to water entry into the high-pressure booster circuit.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-sky-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#0284C7]">05 / REVERSE OSMOSIS</span>
              <h3 className="text-base font-bold text-[#0F172A]">TFC High Rejection Skid</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Vertical multistage pump powers saline water through Dow Filmtec / Hydranautics membranes at 150-250 PSI, rejecting 99%+ minerals.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-sky-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#0284C7]">06 / STERILIZATION</span>
              <h3 className="text-base font-bold text-[#0F172A]">Ultraviolet & Mineralizer</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Stainless chamber UV sterilizer destroys 99.9% of bacteria and viruses, with optional remineralization cartridge for drinking water.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Water Chemistry & TDS Advisor Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <WaterTdsAdvisor />
      </section>

      {/* Forms Section: Site Inspection & Custom Quote */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div id="book-inspection" className="scroll-mt-24">
          <InspectionForm defaultVertical="COMMERCIAL_RO" />
        </div>

        <div id="custom-quote" className="scroll-mt-24">
          <QuoteLeadForm vertical="COMMERCIAL_RO" />
        </div>
      </section>
    </div>
  );
}
