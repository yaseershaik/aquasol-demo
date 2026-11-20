"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Droplets, 
  Sun, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Award
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  client: string;
  location: string;
  vertical: "RO" | "SOLAR";
  capacity: string;
  image: string;
  metrics: {
    label: string;
    value: string;
  }[];
  highlights: string[];
  description: string;
}

const projectsData: Project[] = [
  {
    id: "ro-pharma-10k",
    title: "10,000 LPH Dual-Pass Pharma RO Skid",
    client: "Dr. Reddy's Ancillary Labs",
    location: "Visakhapatnam Pharma City, AP",
    vertical: "RO",
    capacity: "10,000 Liters / Hr",
    image: "/images/real/ro-plant-commercial.jpg",
    metrics: [
      { label: "Raw Water TDS", value: "2,450 PPM" },
      { label: "Permeate TDS", value: "< 12 PPM" },
      { label: "System Recovery", value: "72%" },
    ],
    highlights: [
      "SS-316L sanitary piping with orbital welding",
      "Duplex Dow Filmtec BW30-4040 membrane vessels",
      "Automated CIP (Clean-in-Place) sterilization system"
    ],
    description: "Engineered to satisfy USP purified water standards for intravenous formulation wash lines with integrated 24/7 online conductivity telemetry."
  },
  {
    id: "solar-agro-50kw",
    title: "50 kWp Commercial Rooftop Solar Array",
    client: "Venkateswara Cold Storage Ltd",
    location: "Guntur Agro Cluster, AP",
    vertical: "SOLAR",
    capacity: "50 kWp Grid-Tied",
    image: "/images/real/solar-rooftop-array.jpg",
    metrics: [
      { label: "Monthly Output", value: "6,250 Units" },
      { label: "Annual Savings", value: "₹5.4 Lakhs" },
      { label: "Est. Payback", value: "3.4 Years" },
    ],
    highlights: [
      "Bifacial 550W Tier-1 Monocrystalline modules",
      "Growatt 50kW on-grid inverter with string monitoring",
      "Hot-dip galvanized elevated structure (2.5m clearance)"
    ],
    description: "Turnkey rooftop installation with APEPDCL net-metering synchronization, cutting refrigeration electricity bills by 68%."
  },
  {
    id: "ro-food-5k",
    title: "5,000 LPH High-Recovery RO Plant",
    client: "Coastal Aqua Feeds & Hatchery",
    location: "Kakinada Deep Sea Port, AP",
    vertical: "RO",
    capacity: "5,000 Liters / Hr",
    image: "/images/real/ro-plant-skid.jpg",
    metrics: [
      { label: "Raw Water TDS", value: "3,800 PPM" },
      { label: "Product Water TDS", value: "85 PPM" },
      { label: "Energy Consumption", value: "2.1 kWh/m³" },
    ],
    highlights: [
      "Grundfos CRI high-pressure multistage booster pump",
      "Automatic sand & granular activated carbon filtration",
      "FRP pressure vessels rated to 300 PSI"
    ],
    description: "Designed for intensive hatchery salinity reduction with automated antiscalant chemical dosing."
  },
  {
    id: "solar-res-5kw",
    title: "5 kWp Residential Rooftop Solar + DBT Subsidy",
    client: "Mr. Satyanarayana Rao",
    location: "Madhurawada, Visakhapatnam",
    vertical: "SOLAR",
    capacity: "5 kWp Residential",
    image: "/images/real/solar-rooftop-residential.jpg",
    metrics: [
      { label: "PM Surya Ghar DBT", value: "₹78,000" },
      { label: "Monthly Power Units", value: "620 kWh" },
      { label: "Electricity Bill", value: "Zero (Net Export)" },
    ],
    highlights: [
      "100% Direct DBT subsidy processed in 28 days",
      "Bi-directional net-meter installed by APEPDCL",
      "Real-time mobile app generation tracking"
    ],
    description: "Zero-maintenance RCC rooftop installation powering 3 inverter ACs and household appliances with net energy export to the local grid."
  },
  {
    id: "ro-hospital-2k",
    title: "2,000 LPH Dialysis Grade RO System",
    client: "Apollo Reach Critical Care",
    location: "Rajahmundry, AP",
    vertical: "RO",
    capacity: "2,000 Liters / Hr",
    image: "/images/real/ro-desalination.jpg",
    metrics: [
      { label: "Microbial Purity", value: "0 CFU/ml" },
      { label: "Permeate TDS", value: "< 5 PPM" },
      { label: "Operating Pressure", value: "14.5 Bar" },
    ],
    highlights: [
      "Medical-grade UV sterilizer + 0.2µ endotoxin filter",
      "Dual pump redundancy with automatic changeover",
      "Audited under AAMI/ISO 23500 dialysis guidelines"
    ],
    description: "Continuous ultra-pure water loop for 14 hemodialysis stations with real-time audio-visual pressure fault alarms."
  },
  {
    id: "solar-comm-25kw",
    title: "25 kWp Solar Installation for Hotel & Resort",
    client: "Bay View Luxury Suites",
    location: "Bhimili Coastal Corridor, AP",
    vertical: "SOLAR",
    capacity: "25 kWp On-Grid",
    image: "/images/real/solar-rooftop-array.jpg",
    metrics: [
      { label: "Monthly Output", value: "3,100 Units" },
      { label: "CO₂ Offset", value: "28 Tons/yr" },
      { label: "Annual Savings", value: "₹2.8 Lakhs" },
    ],
    highlights: [
      "Corrosion-resistant anodized aluminium frames",
      "Dual MPPT architecture for shade optimization",
      "Seamless integration with 100 kVA diesel generator"
    ],
    description: "Coastal wind-resistant solar plant powering all day-time lighting, kitchen utilities, and guest water heating pumps."
  }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"ALL" | "RO" | "SOLAR">("ALL");

  const filteredProjects = projectsData.filter((p) => {
    if (filter === "ALL") return true;
    return p.vertical === filter;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-700">
              <Award className="w-3.5 h-3.5" />
              Verified Case Studies
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Real Installations. Measurable Engineering Results.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Explore our portfolio of industrial RO water skids and high-output rooftop solar plants installed across manufacturing plants, hospitals, agro-clusters, and residential properties.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-slate-200 bg-slate-50 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                filter === "ALL"
                  ? "bg-navy-950 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:text-navy-950 border border-slate-200"
              }`}
            >
              All Projects ({projectsData.length})
            </button>
            <button
              onClick={() => setFilter("RO")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                filter === "RO"
                  ? "bg-aqua-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:text-aqua-600 border border-slate-200"
              }`}
            >
              <Droplets className="w-4 h-4" />
              Commercial RO Skids
            </button>
            <button
              onClick={() => setFilter("SOLAR")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                filter === "SOLAR"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:text-amber-600 border border-slate-200"
              }`}
            >
              <Sun className="w-4 h-4" />
              Rooftop Solar Plants
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden md:block">
            Showing <strong className="text-navy-950">{filteredProjects.length}</strong> verified installations
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col"
              >
                {/* Project Image & Badges */}
                <div className="relative h-64 bg-slate-100 overflow-hidden border-b border-slate-200">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition group-hover:scale-105 duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm ${
                      project.vertical === "RO" 
                        ? "bg-aqua-500 text-white" 
                        : "bg-amber-500 text-white"
                    }`}>
                      {project.vertical === "RO" ? "Water Treatment" : "Rooftop Solar"}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 text-navy-950 backdrop-blur-sm shadow-sm">
                      {project.capacity}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.location}</span>
                      <span>•</span>
                      <strong className="text-navy-950">{project.client}</strong>
                    </div>

                    <h2 className="text-xl font-bold text-navy-950 tracking-tight group-hover:text-aqua-600 transition">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-3 gap-3 my-6">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{m.label}</p>
                          <p className="text-sm font-extrabold text-navy-950 mt-0.5">{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                      {project.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Need a similar setup?
                    </span>
                    <Link
                      href={project.vertical === "RO" ? "/commercial-ro#book-inspection" : "/residential-solar#book-inspection"}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        project.vertical === "RO"
                          ? "bg-aqua-50 text-aqua-800 hover:bg-aqua-100 border border-aqua-200"
                          : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                      }`}
                    >
                      <span>Request Site Survey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Ready to Build Your Custom System?
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Our engineers provide complete water TDS lab testing, solar shadow simulations, and formal feasibility reports within 48 hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/commercial-ro#book-inspection"
              className="px-6 py-3 bg-aqua-600 hover:bg-aqua-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
            >
              Book RO Water Survey
            </Link>
            <Link
              href="/residential-solar#book-inspection"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
            >
              Book Rooftop Solar Survey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
