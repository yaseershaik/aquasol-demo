"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Zap,
  Droplets,
  Sun,
  Truck,
  CreditCard,
  UserCheck,
  PhoneCall,
  FileText,
  Sliders,
} from "lucide-react";

export default function AdminStorefrontExplorerPage() {
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeUrl, setActiveUrl] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);

  const customerSections = [
    {
      category: "Customer Experience & Landing Pages",
      pages: [
        {
          title: "Storefront Home",
          path: "/",
          icon: Globe,
          color: "from-sky-600 to-blue-600",
          desc: "Main hero showcase, live TDS calculator, PM Surya Ghar subsidy tool, industrial RO solutions, featured products, and branch office directory.",
          tags: ["Public", "Hero", "Featured SKUs", "Calculators"],
        },
        {
          title: "Commercial RO Plants",
          path: "/commercial-ro",
          icon: Droplets,
          color: "from-cyan-600 to-sky-600",
          desc: "Turnkey industrial RO skids (250 to 50,000+ LPH), membrane engineering specs, multi-port valves, and on-site inspection booking form.",
          tags: ["Commercial", "Water Treatment", "Turnkey Skids"],
        },
        {
          title: "Residential Solar Systems",
          path: "/residential-solar",
          icon: Sun,
          color: "from-amber-500 to-orange-600",
          desc: "PM Surya Ghar subsidy eligibility, Tier-1 Mono PERC & TOPCon panels, rooftop survey scheduler, and grid-tie payback estimator.",
          tags: ["Rooftop Solar", "PM Surya Ghar", "Subsidy"],
        },
        {
          title: "Products & Spares Catalog",
          path: "/products",
          icon: Package,
          color: "from-blue-600 to-indigo-600",
          desc: "Full equipment & replacement parts store with vertical category filters, live stock status, GST breakdown, and pan-India shipping.",
          tags: ["E-Commerce", "Pan-India", "Filters", "Cart"],
        },
        {
          title: "Turnkey Case Studies",
          path: "/projects",
          icon: Layers,
          color: "from-emerald-600 to-teal-600",
          desc: "Turnkey industrial RO installations, hospital water treatment plants, and MW solar park portfolio case studies across South India.",
          tags: ["Projects", "Portfolio", "Engineering"],
        },
        {
          title: "Company Credentials & About",
          path: "/about",
          icon: ShieldCheck,
          color: "from-slate-700 to-slate-900",
          desc: "ISO 9001:2015 certifications, engineering leadership, and regional hub locations (Visakhapatnam, Vijayawada, Hyderabad, Tirupati).",
          tags: ["Corporate", "ISO Cert", "Regional Hubs"],
        },
        {
          title: "Contact & Engineering Helpdesk",
          path: "/contact",
          icon: PhoneCall,
          color: "from-rose-600 to-pink-600",
          desc: "Branch office contact directories, phone lines (+91 98765 43210), WhatsApp direct chat, and technical inquiry submission form.",
          tags: ["Helpdesk", "Lead Form", "WhatsApp"],
        },
      ],
    },
    {
      category: "Customer Portals & Transactional Tools",
      pages: [
        {
          title: "Live Order Tracking Portal",
          path: "/track-order",
          icon: Truck,
          color: "from-purple-600 to-blue-600",
          desc: "Real-time dispatch tracking lookup for customers using Order Number (ORD-...) and registered mobile phone number.",
          tags: ["Self-Service", "Courier Sync", "Blue Dart / DTDC"],
        },
        {
          title: "Customer Account & Portal",
          path: "/account",
          icon: UserCheck,
          color: "from-sky-600 to-teal-600",
          desc: "Customer dashboard featuring purchase history, tracking numbers, booked site surveys, and B2B GST company profiles.",
          tags: ["Customer Portal", "Order History", "B2B Profile"],
        },
        {
          title: "Shopping Cart & Bag",
          path: "/cart",
          icon: CreditCard,
          color: "from-amber-600 to-yellow-600",
          desc: "Interactive cart drawer with live subtotal, 18% GST calculation, Free Shipping threshold progress, and coupon discount promo codes.",
          tags: ["Cart", "GST Invoice", "Promotions"],
        },
        {
          title: "Customer Checkout Flow",
          path: "/checkout",
          icon: Zap,
          color: "from-emerald-600 to-green-700",
          desc: "Secure checkout supporting Cash on Delivery (COD) and Razorpay Online Payment with automated order confirmation.",
          tags: ["Checkout", "COD", "Razorpay"],
        },
      ],
    },
  ];

  const handleReloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Storefront Operations & Live Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Website Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            From this console, you can inspect, test, and interact with every single page, calculator, portal, and checkout flow on the customer-facing website in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Open Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors shadow-xs"
          >
            Edit Site CMS & Banners
          </Link>
        </div>
      </div>

      {/* Interactive Simulator Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Simulator Title and Active Path */}
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
              Embedded Customer Viewport
            </span>
            <span className="text-xs font-mono text-[#0284C7] bg-white px-2.5 py-1 rounded border border-slate-200 font-semibold">
              {activeUrl}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Device Switcher */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setSelectedDevice("desktop")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedDevice === "desktop"
                    ? "bg-sky-50 text-[#0284C7] shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Desktop View (Full Width)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setSelectedDevice("tablet")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedDevice === "tablet"
                    ? "bg-sky-50 text-[#0284C7] shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setSelectedDevice("mobile")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedDevice === "mobile"
                    ? "bg-sky-50 text-[#0284C7] shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Refresh iframe button */}
            <button
              onClick={handleReloadIframe}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Reload Frame"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Open Target in New Window */}
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-[#0284C7] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Open currently loaded customer page in a new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Iframe Viewport Frame */}
        <div className="bg-slate-100 p-2 sm:p-6 flex items-center justify-center min-h-[620px] max-h-[780px] overflow-x-auto">
          <div
            className={`h-[680px] max-w-full transition-all duration-300 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xl flex flex-col ${
              selectedDevice === "desktop"
                ? "w-full"
                : selectedDevice === "tablet"
                ? "w-[768px]"
                : "w-[390px]"
            }`}
          >
            <iframe
              key={iframeKey}
              src={activeUrl}
              title="Live Customer Website Simulator"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>

      {/* Customer Pages & Interactive Simulators Directory */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-wide">
            Direct Customer Website Navigation Index
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click &quot;Simulate&quot; to test directly above, or &quot;Open New Tab&quot; to test in public browser mode.
          </p>
        </div>

        {customerSections.map((sec, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-l-2 border-[#0284C7] pl-2.5">
              {sec.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sec.pages.map((p) => {
                const Icon = p.icon;
                const isCurrent = activeUrl === p.path;

                return (
                  <div
                    key={p.path}
                    className={`bg-white border rounded-xl p-4 flex flex-col justify-between transition-all group ${
                      isCurrent
                        ? "border-[#0284C7] ring-1 ring-[#0284C7]/40 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-xs`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500">
                          {p.path}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                        {p.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 gap-2">
                      <button
                        onClick={() => {
                          setActiveUrl(p.path);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                          isCurrent
                            ? "bg-[#0284C7] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isCurrent ? "Active In View" : "Simulate"}</span>
                      </button>

                      <a
                        href={p.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                        title="Open live customer page in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
