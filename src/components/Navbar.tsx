"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCartCount } from "@/lib/cart";
import { getStoredUser, clearAuthData, UserProfile } from "@/lib/user-auth";
import { useSiteConfig } from "@/context/SiteConfigContext";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Droplets,
  Sun,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Package,
  ArrowRight,
  MapPin,
  Award,
  Layers,
  MessageCircle,
} from "lucide-react";

export default function Navbar() {
  const { config } = useSiteConfig();
  const [cartCount, setCartCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState<boolean>(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const updateCount = () => {
    setCartCount(getCartCount());
  };

  const checkUser = () => {
    setCurrentUser(getStoredUser());
  };

  useEffect(() => {
    updateCount();
    checkUser();

    window.addEventListener("puregrid-cart-updated", updateCount);
    window.addEventListener("aquasol-auth-change", checkUser);
    window.addEventListener("storage", () => {
      updateCount();
      checkUser();
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setCompanyMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("puregrid-cart-updated", updateCount);
      window.removeEventListener("aquasol-auth-change", checkUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCompanyMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    clearAuthData();
    setUserDropdownOpen(false);
    router.push("/auth/login");
  };

  const helpline = config.phone || "+91 98765 43210";
  const whatsappNum = (config.whatsapp || "919876543210").replace(/\D/g, "");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Sleek, Compact Main Navbar (Single Bar - No Cluttered Top Ribbon) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Mark: AQUASOL */}
          <Link href="/" className="flex items-center space-x-2.5 group select-none py-1">
            <div className="w-9 h-9 rounded-lg bg-[#0A192F] p-0.5 border border-slate-300 flex items-center justify-center relative overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4 text-[#0284C7] absolute left-1 bottom-1" />
              <Sun className="w-4 h-4 text-[#D97706] absolute right-1 top-1" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center leading-none">
                <span className="text-xl font-black text-[#0284C7] tracking-tight">AQUA</span>
                <span className="text-xl font-black text-[#D97706] tracking-tight">SOL</span>
              </div>
              <span className="text-[9px] tracking-widest uppercase font-semibold text-slate-500 mt-0.5">
                Water & Solar Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            <Link
              href="/commercial-ro"
              className={`text-xs sm:text-sm font-semibold transition-colors py-1 flex items-center gap-1.5 ${
                pathname === "/commercial-ro"
                  ? "text-[#0A192F] font-bold border-b-2 border-[#0284C7]"
                  : "text-slate-600 hover:text-[#0284C7]"
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Commercial RO</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                Aqua
              </span>
            </Link>

            <Link
              href="/residential-solar"
              className={`text-xs sm:text-sm font-semibold transition-colors py-1 flex items-center gap-1.5 ${
                pathname === "/residential-solar"
                  ? "text-[#0A192F] font-bold border-b-2 border-[#D97706]"
                  : "text-slate-600 hover:text-[#D97706]"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Rooftop Solar</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Sol
              </span>
            </Link>

            <Link
              href="/products"
              className={`text-xs sm:text-sm font-semibold transition-colors py-1 flex items-center gap-1.5 ${
                pathname?.startsWith("/products")
                  ? "text-[#0A192F] font-bold border-b-2 border-[#0A192F]"
                  : "text-slate-600 hover:text-[#0A192F]"
              }`}
            >
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>Spare Parts</span>
            </Link>

            <Link
              href="/projects"
              className={`text-xs sm:text-sm font-semibold transition-colors py-1 flex items-center gap-1.5 ${
                pathname === "/projects"
                  ? "text-[#0A192F] font-bold border-b-2 border-[#0A192F]"
                  : "text-slate-600 hover:text-[#0A192F]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Case Studies</span>
            </Link>

            {/* Company Dropdown */}
            <div className="relative" ref={companyDropdownRef}>
              <button
                type="button"
                onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
                className={`text-xs sm:text-sm font-semibold transition-colors py-1 flex items-center gap-1 ${
                  pathname === "/about" || pathname === "/contact"
                    ? "text-[#0A192F] font-bold"
                    : "text-slate-600 hover:text-[#0A192F]"
                }`}
              >
                <span>Company</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${companyMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {companyMenuOpen && (
                <div className="absolute top-full -left-2 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <Link
                    href="/about"
                    onClick={() => setCompanyMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0A192F]"
                  >
                    <Award className="w-3.5 h-3.5 text-sky-600" />
                    <span>About AQUASOL Systems</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setCompanyMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0A192F]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Regional Operating Hubs</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Cluster: Direct Helpline + WhatsApp + Track + Account + Cart + Inspection CTA */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {/* Quick Live Contact Shortcuts (Clean Inline) */}
            <a
              href={`tel:${helpline.replace(/\s+/g, "")}`}
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] px-2 py-1.5 rounded-lg hover:bg-slate-50 transition"
              title="Customer Support Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="font-mono">{helpline}</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNum}?text=Hello%20AQUASOL%20Systems,%20I%20need%20assistance.`}
              target="_blank"
              rel="noreferrer"
              className="hidden 2xl:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition"
              title="Direct WhatsApp Helpline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0A192F] bg-slate-50 hover:bg-white transition"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[85px] truncate">{currentUser.name.split(" ")[0]}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#0A192F]">{currentUser.name}</p>
                        {currentUser.role === "admin" && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase border border-amber-300">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    {currentUser.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#0284C7] bg-sky-50/70 hover:bg-sky-50 border-b border-slate-100"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Operations Console</span>
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Dashboard</span>
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Orders</span>
                    </Link>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0A192F] hover:bg-slate-50 transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 text-[#0A192F] hover:bg-slate-50 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#0284C7] text-white text-[10px] font-bold h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Primary Action CTA */}
            <Link
              href="/commercial-ro#book-inspection"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg shadow-xs transition-colors"
            >
              <span>Book Inspection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Right: Cart & Compact Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-lg border border-slate-200 text-[#0A192F]"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0284C7] text-white text-[10px] font-bold h-4 min-w-[16px] px-0.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 text-[#0A192F] hover:bg-slate-50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* User Sign In / Profile in Mobile */}
          {currentUser ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[#0A192F] text-xs">{currentUser.name}</p>
                    {currentUser.role === "admin" && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase border border-amber-300">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md text-[11px] font-semibold"
                >
                  Sign Out
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex-1 text-center py-1.5 bg-[#0A192F] text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex-1 text-center py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Account Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0A192F] text-xs">Customer Account</p>
                  <p className="text-[11px] text-slate-500">Sign in to track orders & site visits</p>
                </div>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 bg-[#0284C7] text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Sign In
                </Link>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Operations & Logistics:</span>
                <Link
                  href="/admin/login"
                  className="text-[#0284C7] font-bold hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Console Sign In &rarr;</span>
                </Link>
              </div>
            </div>
          )}

          {/* Solutions & Core Links */}
          <div className="space-y-1">
            <Link
              href="/commercial-ro"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname === "/commercial-ro" ? "bg-sky-50 text-[#0284C7]" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#0284C7]" />
                <span>Commercial RO Plants</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">250 - 50k LPH</span>
            </Link>

            <Link
              href="/residential-solar"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname === "/residential-solar" ? "bg-amber-50 text-[#D97706]" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#D97706]" />
                <span>Rooftop Solar Plants</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">₹78k Subsidy</span>
            </Link>

            <Link
              href="/products"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname?.startsWith("/products") ? "bg-slate-100 text-[#0A192F]" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                <span>Spare Parts Store</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
            </Link>

            <Link
              href="/projects"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname === "/projects" ? "bg-slate-100 text-[#0A192F]" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Case Studies</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
            </Link>
          </div>

          {/* Company Links */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <Link
              href="/about"
              className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              About AQUASOL Systems
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Regional Operating Hubs & Contact
            </Link>
          </div>

          {/* Mobile Actions with Dynamic Config Numbers */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/commercial-ro#book-inspection"
              className="w-full text-center py-2.5 bg-[#0284C7] text-white font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Book Site Inspection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={`tel:${helpline.replace(/\s+/g, "")}`}
              className="w-full text-center py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Call Helpline: {helpline}</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNum}?text=Hello%20AQUASOL%20Systems`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Direct Support</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
