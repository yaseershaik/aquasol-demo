import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import HeroInteractive from "@/components/HeroInteractive";
import QuickSubsidyCalculator from "@/components/QuickSubsidyCalculator";
import WaterTdsAdvisor from "@/components/WaterTdsAdvisor";
import FaqSection from "@/components/FaqSection";
import {
  Droplets,
  Sun,
  ShieldCheck,
  Truck,
  Wrench,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Zap,
  Award,
} from "lucide-react";

export const revalidate = 0; // Live dynamic data for inventory & CMS

export default async function HomePage() {
  const [config, featuredProducts, portfolioProjects] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "default" } }),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true },
      take: 4,
    }),
    prisma.portfolioProject.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const heroTitle = config?.heroTitle || "Engineered Clean Water & Solar Energy for Homes and Enterprise";
  const heroSubtitle =
    config?.heroSubtitle ||
    "Order genuine RO spare parts with live inventory across India, schedule on-site water quality audits, or deploy subsidized rooftop solar.";

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Interactive Switcher Hero Section */}
      <HeroInteractive heroTitle={heroTitle} heroSubtitle={heroSubtitle} />

      {/* Dual Vertical Deep Dive Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-3 text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-[#0284C7] rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Core Engineering Solutions
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Commercial Water & Clean Rooftop Power
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            Select your vertical to explore turnkey project engineering, browse genuine spare parts, or schedule an on-site technician audit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Aqua / Commercial RO */}
          <div className="hover-lift bg-gradient-to-b from-[#F0F9FF]/40 to-[#FFFFFF] border border-sky-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#0284C7] text-[#FFFFFF] flex items-center justify-center shadow-md">
                  <Droplets className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  Vertical 01 • Clean Water
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">
                  Commercial RO Water Plants
                </h3>
                <p className="text-xs font-semibold text-[#0284C7] mt-0.5">
                  250 LPH to 50,000+ LPH Turnkey Custom Skids
                </p>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed">
                Industrial multi-stage reverse osmosis units tailored to your raw borewell chemistry. 
                Built for hospitals, educational institutions, bottling lines, and factories with custom quartz sand/carbon filtration, antiscalant dosing, and automatic backwash valves.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-sky-100 text-xs font-semibold text-[#0F172A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>Food-grade SS-304/316 skids & vertical high-pressure pumps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>99%+ salt and dissolved mineral rejection guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>Annual Maintenance Contracts (AMC) with breakdown guarantee</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-sky-100 mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/commercial-ro"
                className="btn-interactive flex-1 text-center py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-[#FFFFFF] text-sm font-bold rounded-lg shadow-sm"
              >
                Plant Specifications
              </Link>
              <Link
                href="/commercial-ro#book-inspection"
                className="btn-interactive flex-1 text-center py-2.5 px-4 border border-[#0284C7] text-[#0284C7] text-sm font-bold rounded-lg hover:bg-sky-50"
              >
                Book Water Audit
              </Link>
            </div>
          </div>

          {/* Card 2: Sol / Residential Solar */}
          <div className="hover-lift bg-gradient-to-b from-[#FFFBEB]/40 to-[#FFFFFF] border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#D97706] text-[#FFFFFF] flex items-center justify-center shadow-md">
                  <Sun className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  Vertical 02 • Clean Energy
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">
                  Residential Rooftop Solar
                </h3>
                <p className="text-xs font-semibold text-[#D97706] mt-0.5">
                  1 kW to 10 kW On-Grid Systems with DBT Subsidy
                </p>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed">
                Turnkey grid-connected solar power systems. Complete facilitation of PM Surya Ghar Muft Bijli Yojana direct bank transfer subsidies (up to ₹78,000) and AP Discom bidirectional smart net metering.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-amber-100 text-xs font-semibold text-[#0F172A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Tier-1 Monocrystalline Bifacial Solar Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>25-Year Panel Performance Warranty & High Efficiency Inverters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>End-to-end DISCOM net meter testing and subsidy claim filing</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-amber-100 mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/residential-solar"
                className="btn-interactive flex-1 text-center py-2.5 px-4 bg-[#D97706] hover:bg-[#B45309] text-[#FFFFFF] text-sm font-bold rounded-lg shadow-sm"
              >
                Solar Packages & Subsidy
              </Link>
              <Link
                href="/residential-solar#book-inspection"
                className="btn-interactive flex-1 text-center py-2.5 px-4 border border-[#D97706] text-[#D97706] text-sm font-bold rounded-lg hover:bg-amber-50"
              >
                Book Roof Survey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Water Chemistry & TDS Advisor Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <WaterTdsAdvisor />
      </section>

      {/* Interactive Quick Subsidy Calculator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <QuickSubsidyCalculator />
      </section>

      {/* Featured Spare Parts Live Store */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E2E8F0] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Truck className="w-3.5 h-3.5 text-[#0284C7]" /> Component Store
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Live Industrial Spare Parts
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1">
              Factory-sealed membranes, booster pumps, FRP vessels, and on-grid solar inverters.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center text-sm font-bold text-[#0284C7] hover:underline"
          >
            Explore Complete Catalog ({featuredProducts.length}+ components) <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="p-8 text-center border border-[#E2E8F0] rounded-xl bg-slate-50">
            <p className="text-sm text-slate-500">No featured products available at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Portfolio / Recent Installations Showcase */}
      {portfolioProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 pb-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" /> Track Record
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Commissioned Engineering Projects
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                Verified installations operating across industrial corridors and residential complexes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioProjects.map((project) => {
              const isRo = project.vertical === "RO";
              return (
                <div
                  key={project.id}
                  className={`hover-lift bg-[#FFFFFF] border rounded-2xl p-6 flex flex-col justify-between shadow-xs ${
                    isRo ? "border-sky-200" : "border-amber-200"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Visual Asset Thumbnail */}
                    <div className="aspect-[16/9] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative">
                      <img
                        src={project.imageUrl || (isRo ? "/images/real/ro-plant-skid.jpg" : "/images/real/solar-rooftop-residential.jpg")}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span
                          className={`font-bold uppercase tracking-wider px-2.5 py-0.5 rounded text-[11px] ${
                            isRo ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isRo ? "Water Purification" : "Rooftop Solar"}
                        </span>
                        <span className="font-semibold text-slate-600">{project.location}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A]">{project.title}</h3>
                      <div className="mt-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" /> Installed Capacity: {project.capacity}
                      </div>
                      <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Interactive FAQ Section */}
      <FaqSection />

      {/* Trust & Guarantee Banner in Deep Marine Navy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0A192F] text-[#FFFFFF] rounded-2xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <h3 className="text-lg font-bold">100% Genuine OEM Hardware</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every membrane element, high-pressure pump, and solar inverter carries official manufacturer warranty documentation and serial authentication.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <Truck className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h3 className="text-lg font-bold">Pan-India Freight Logistics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Surface express transport with protective wooden crating for delicate membranes and heavy FRP vessels. Real-time courier tracking on every shipment.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <Wrench className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <h3 className="text-lg font-bold">Dedicated Engineering Team</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our site technicians conduct water chemistry tests, pump pressure balancing, and manage DISCOM net metering approvals directly with electricity authorities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
