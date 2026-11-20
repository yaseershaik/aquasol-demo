"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle2,
  ArrowUpRight,
  Droplets,
  Sun,
  ShieldCheck,
  Award,
  Send,
  FileText,
  Clock,
} from "lucide-react";

export default function Footer() {
  const { config } = useSiteConfig();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const partners = [
    { name: "Dow Filmtec", role: "TFC RO Membranes" },
    { name: "Grundfos", role: "Multistage Pumps" },
    { name: "Growatt", role: "Smart Inverters" },
    { name: "Schneider", role: "Industrial Switchgear" },
    { name: "PM Surya Ghar", role: "DBT Subsidy Empaneled" },
    { name: "APEPDCL / TGSPDCL", role: "Discom Net-Metering" },
  ];

  const phoneNum = config.phone || "+91 98765 43210";
  const whatsappNum = (config.whatsapp || "919876543210").replace(/\D/g, "");
  const supportEmail = config.email || "contact@puregridsystems.in";
  const companyAddress = config.address || "Plot 42, APIIC Industrial Park, Visakhapatnam, Andhra Pradesh 530012";
  const bizName = config.businessName || "AQUASOL PureGrid Systems";

  return (
    <footer className="bg-[#0A192F] text-white border-t border-slate-800">
      {/* 1. OEM Partners & Technical Certification Band */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-sky-400" />
              <span>OEM Component & Grid Net-Metering Standards:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-5">
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs"
                >
                  <span className="font-bold text-slate-200">{partner.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({partner.role})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Technical Whitepaper & Feasibility Form */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 bg-slate-950/20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950 text-sky-300 text-[10px] font-semibold mb-2 border border-sky-800/60 uppercase tracking-wider">
              <FileText className="w-3 h-3" />
              Engineering Resources & Subsidy Updates
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Get Free Water TDS & Solar Feasibility Whitepaper
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Receive practical guides on borewell TDS salinity reduction, membrane antiscalant dosing, and PM Surya Ghar ₹78,000 DBT clearance.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! The engineering whitepaper has been dispatched to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your engineer or plant email..."
                  className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#0284C7] hover:bg-sky-600 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Get Whitepaper</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Multi-Column Informational Hierarchy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Identity & Customer Credentials (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0A192F] p-0.5 border border-slate-700 flex items-center justify-center relative overflow-hidden shadow-xs">
                <Droplets className="w-3.5 h-3.5 text-[#0284C7] absolute left-1 bottom-1" />
                <Sun className="w-3.5 h-3.5 text-[#D97706] absolute right-1 top-1" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight">
                  <span className="text-lg font-black text-[#0284C7]">AQUA</span>
                  <span className="text-lg font-black text-[#D97706]">SOL</span>
                  <span className="ml-2 text-[9px] font-bold uppercase px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700">
                    Systems
                  </span>
                </div>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-slate-400">
                  Industrial Water & Solar Grid Systems
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              ISO 9001:2015 certified engineering firm. We design and fabricate commercial reverse osmosis plants (250 to 50,000+ LPH) and execute turnkey residential rooftop solar installations with direct PM Surya Ghar DBT subsidies.
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>GST Compliant Invoicing with 100% B2B Input Tax Credit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Empaneled for Direct DBT Central Solar Subsidies (₹78k)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Prompt On-Site Service Engineers stationed across AP & TS</span>
              </div>
            </div>

            {/* Dynamic Customer Helpline Box from SiteConfig */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3 mt-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Customer Support Helpline</p>
                <a href={`tel:${phoneNum.replace(/\s+/g, "")}`} className="text-xs font-bold text-white hover:text-sky-300 transition font-mono">
                  {phoneNum}
                </a>
                <p className="text-[10px] text-slate-400 mt-0.5">{supportEmail}</p>
              </div>
              <a
                href={`https://wa.me/${whatsappNum}?text=Hello%20AQUASOL%20Systems`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Water Solutions (Aqua) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              <span>Commercial RO</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/commercial-ro" className="hover:text-white transition-colors">
                  Plant Capacities (250 - 50k LPH)
                </Link>
              </li>
              <li>
                <Link href="/commercial-ro#book-inspection" className="hover:text-white transition-colors">
                  Site Water Quality Audit
                </Link>
              </li>
              <li>
                <Link href="/commercial-ro#custom-quote" className="hover:text-white transition-colors">
                  Custom Plant Proposal
                </Link>
              </li>
              <li>
                <Link href="/products?vertical=RO" className="hover:text-white transition-colors">
                  Dow Filmtec Membranes
                </Link>
              </li>
              <li>
                <Link href="/products?vertical=RO" className="hover:text-white transition-colors">
                  Grundfos Booster Pumps
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Pharma & Hospital RO Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solar Energy (Sol) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>Residential Solar</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/residential-solar" className="hover:text-white transition-colors">
                  Rooftop Systems (1 - 10 kW)
                </Link>
              </li>
              <li>
                <Link href="/residential-solar#subsidy-guide" className="hover:text-white transition-colors">
                  PM Surya Ghar Subsidy Guide (₹78k)
                </Link>
              </li>
              <li>
                <Link href="/residential-solar#book-inspection" className="hover:text-white transition-colors">
                  Roof Shadow Assessment
                </Link>
              </li>
              <li>
                <Link href="/products?vertical=SOLAR" className="hover:text-white transition-colors">
                  Growatt On-Grid Inverters
                </Link>
              </li>
              <li>
                <Link href="/residential-solar" className="hover:text-white transition-colors">
                  Discom Net-Metering Guide
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Commercial Rooftop Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Regional Hubs */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Operating Hubs</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <p className="font-bold text-white">Visakhapatnam (HQ & Works)</p>
                <p className="text-[11px] text-slate-400">{companyAddress}</p>
                <p className="text-[11px] text-sky-400">{phoneNum}</p>
              </li>
              <li>
                <p className="font-bold text-white">Vijayawada & Guntur Hub</p>
                <p className="text-[11px] text-slate-400">Ring Road, Near Benz Circle</p>
              </li>
              <li>
                <p className="font-bold text-white">Hyderabad Regional Hub</p>
                <p className="text-[11px] text-slate-400">Plot 12, IDA Mallapur</p>
              </li>
              <li>
                <p className="font-bold text-white">Tirupati Regional Center</p>
                <p className="text-[11px] text-slate-400">Renigunta Road, Tirupati, AP</p>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Bottom Legal & Consumer Info Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {bizName}. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center space-x-5 text-xs text-slate-300">
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/projects" className="hover:text-white transition-colors">
              Case Studies
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact & Hubs
            </Link>
            <Link href="/track-order" className="hover:text-white transition-colors">
              Order Tracking
            </Link>
            <Link href="/products" className="hover:text-white transition-colors">
              Spare Parts Store
            </Link>
            <Link href="/admin/login" className="hover:text-sky-400 transition-colors flex items-center gap-1 font-semibold text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
