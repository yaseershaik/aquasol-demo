"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CalendarCheck2,
  Settings,
  ExternalLink,
  LogOut,
  Droplets,
  Sun,
  Globe,
  MessageSquareText,
  Users,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  X,
  ChevronDown,
  Layers,
  Menu,
} from "lucide-react";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [operator, setOperator] = useState<{ email: string; name: string } | null>(null);

  // Live Customer Simulator Modal State
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatorDevice, setSimulatorDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [simulatorUrl, setSimulatorUrl] = useState("/");

  // Quick Storefront Dropdown
  const [storefrontMenuOpen, setStorefrontMenuOpen] = useState(false);
  // Mobile Operations Drawer
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setOperator(data.user);
          }
        }
      } catch {
        // Silently ignore session check failure
      }
    }
    checkSession();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Sign out error", err);
    }
    window.location.href = "/admin/login";
  };

  // If on login page, render clean auth wrapper without internal console chrome
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Storefront Hub", href: "/admin/explorer", icon: Globe, badge: "Live" },
    { name: "Products & Stock", href: "/admin/products", icon: Package },
    { name: "Orders & Shipping", href: "/admin/orders", icon: ShoppingCart },
    { name: "Surveys & Leads", href: "/admin/bookings", icon: CalendarCheck2 },
    { name: "Quotes & Inquiries", href: "/admin/leads", icon: MessageSquareText },
    { name: "Customer Directory", href: "/admin/customers", icon: Users },
    { name: "Site CMS & Settings", href: "/admin/settings", icon: Settings },
  ];

  const customerPages = [
    { title: "Storefront Home", path: "/", desc: "Hero, TDS Advisor, Solar Estimator, Featured SKUs" },
    { title: "Products Catalog", path: "/products", desc: "Full Parts & Equipment Catalog with Filters" },
    { title: "Commercial RO Systems", path: "/commercial-ro", desc: "Turnkey Industrial RO Skids (250-50,000 LPH)" },
    { title: "Residential Solar", path: "/residential-solar", desc: "PM Surya Ghar Subsidies & Rooftop Solar" },
    { title: "Track Customer Order", path: "/track-order", desc: "Live Dispatch & Courier Status Lookup" },
    { title: "Customer Account Portal", path: "/account", desc: "My Orders, Survey Status & B2B Profile" },
    { title: "Shopping Cart & Bag", path: "/cart", desc: "Cart Items, Discounts & GST Calculation" },
    { title: "Customer Checkout", path: "/checkout", desc: "Delivery Address & Payment Selection" },
    { title: "Turnkey Projects", path: "/projects", desc: "Industrial Case Studies & Photo Gallery" },
    { title: "About PureGrid", path: "/about", desc: "Company Credentials, ISO & Branch Hubs" },
    { title: "Contact Us & Support", path: "/contact", desc: "Customer Helpdesk & Regional Hubs" },
  ];

  const openSimulatorAt = (path: string) => {
    setSimulatorUrl(path);
    setSimulatorOpen(true);
    setStorefrontMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#0284C7] selection:text-white">
      {/* Main Executive Header matching Customer Branding */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Matching AQUASOL Brand Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2.5 group select-none py-1">
                <div className="w-9 h-9 rounded-lg bg-[#0A192F] p-0.5 border border-slate-300 flex items-center justify-center relative overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                  <Droplets className="w-4 h-4 text-[#0284C7] absolute left-1 bottom-1" />
                  <Sun className="w-4 h-4 text-[#D97706] absolute right-1 top-1" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center leading-none">
                    <span className="text-xl font-black text-[#0284C7] tracking-tight">AQUA</span>
                    <span className="text-xl font-black text-[#D97706] tracking-tight">SOL</span>
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-sky-50 text-[#0284C7] border border-sky-200">
                      Admin Console
                    </span>
                  </div>
                  <span className="hidden sm:block text-[9px] tracking-widest uppercase font-semibold text-slate-500 mt-0.5">
                    Water & Solar Systems &bull; Operations
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Controls: Operator Info & Mobile Drawer Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Operator info / signout */}
              {operator ? (
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="hidden xl:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-800">
                      {operator.name || "Administrator"}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                      {operator.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out of Operations Console"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-sky-700 text-white font-semibold transition-colors shadow-sm"
                >
                  Sign In
                </Link>
              )}
              {/* Mobile Drawer Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Operations Menu"
              >
                {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Subnavigation Bar (Touch-Optimized Horizontal Scroll on Small Screens) */}
          <nav className="flex space-x-1.5 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none touch-pan-x">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-sky-50 text-[#0284C7] border border-sky-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#0284C7]" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-sky-100 text-[#0284C7] border border-sky-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Slide-Down Operations Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {operator && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{operator.name || "Administrator"}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">{operator.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-sky-50 text-[#0284C7] border border-sky-200 font-bold shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0284C7]" : "text-slate-500"}`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/admin/explorer"
                onClick={() => setMobileNavOpen(false)}
                className="text-[#0284C7] font-semibold hover:underline flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Storefront Hub</span>
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 font-semibold hover:text-slate-900 flex items-center gap-1"
              >
                <span>Live Customer Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Console Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Matching Clean Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-5 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-[#0A192F] p-0.5 flex items-center justify-center relative overflow-hidden">
              <Droplets className="w-2.5 h-2.5 text-[#0284C7] absolute left-0.5 bottom-0.5" />
              <Sun className="w-2.5 h-2.5 text-[#D97706] absolute right-0.5 top-0.5" />
            </div>
            <span className="font-bold text-slate-800">
              AQUASOL Systems Console
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-600">PureGrid Water & Solar Operations Portal</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              FastAPI v1.0.0
            </span>
            <span>&bull;</span>
            <span>Next.js 15 Production</span>
            <span>&bull;</span>
            <span>Dual-Engine Relational Sync</span>
            <span>&bull;</span>
            <button
              onClick={() => openSimulatorAt("/")}
              className="text-[#0284C7] hover:underline font-semibold"
            >
              Simulate Storefront
            </button>
          </div>
        </div>
      </footer>

      {/* Embedded Live Customer Simulator Modal */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Simulator Header Bar */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-[#0284C7]" />
                  <span>Live Customer Storefront Simulator</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  <span className="text-[#0284C7] font-semibold">Viewing:</span>
                  <span className="font-mono text-slate-800">{simulatorUrl}</span>
                </div>
              </div>

              {/* Viewport & Navigation Controls */}
              <div className="flex items-center space-x-2">
                {/* Route Selector */}
                <select
                  value={simulatorUrl}
                  onChange={(e) => setSimulatorUrl(e.target.value)}
                  className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0284C7]"
                >
                  {customerPages.map((page) => (
                    <option key={page.path} value={page.path}>
                      {page.title} ({page.path})
                    </option>
                  ))}
                </select>

                {/* Device Switcher */}
                <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setSimulatorDevice("desktop")}
                    className={`p-1.5 rounded-md transition-colors ${
                      simulatorDevice === "desktop"
                        ? "bg-sky-50 text-[#0284C7] shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Desktop View (100% width)"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorDevice("tablet")}
                    className={`p-1.5 rounded-md transition-colors ${
                      simulatorDevice === "tablet"
                        ? "bg-sky-50 text-[#0284C7] shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Tablet View (768px)"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorDevice("mobile")}
                    className={`p-1.5 rounded-md transition-colors ${
                      simulatorDevice === "mobile"
                        ? "bg-sky-50 text-[#0284C7] shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Mobile View (375px)"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                {/* Open in real new tab */}
                <a
                  href={simulatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-[#0284C7] hover:bg-slate-100 rounded-lg transition-colors"
                  title="Open in new browser tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setSimulatorOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Close Simulator"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded Iframe Container */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xl flex flex-col ${
                  simulatorDevice === "desktop"
                    ? "w-full"
                    : simulatorDevice === "tablet"
                    ? "w-[768px]"
                    : "w-[390px]"
                }`}
              >
                <iframe
                  src={simulatorUrl}
                  title="Customer Website Live Preview"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
