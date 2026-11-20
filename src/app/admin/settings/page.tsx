"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Globe,
  Sliders,
  DollarSign,
  Truck,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [businessName, setBusinessName] = useState("PureGrid Systems");
  const [tagline, setTagline] = useState("Commercial RO Plants, Spare Parts & Residential Solar Installations");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [whatsapp, setWhatsapp] = useState("919876543210");
  const [email, setEmail] = useState("contact@puregridsystems.in");
  const [address, setAddress] = useState("Plot 42, APIIC Industrial Park, Visakhapatnam, Andhra Pradesh 530012");
  const [serviceCities, setServiceCities] = useState("Pan-India Parts Delivery | Local Site Inspections");
  const [heroTitle, setHeroTitle] = useState("Reliable Water Purification & Rooftop Solar Power");
  const [heroSubtitle, setHeroSubtitle] = useState("Order genuine RO spare parts across India, schedule a site inspection, or request a custom installation quote.");
  const [heroBannerUrl, setHeroBannerUrl] = useState("/images/hero/solar-ro-panoramic.jpg");
  const [roBannerUrl, setRoBannerUrl] = useState("/images/commercial/industrial-skid-hero.jpg");
  const [solarBannerUrl, setSolarBannerUrl] = useState("/images/solar/rooftop-monoperc-grid.jpg");
  const [codEnabled, setCodEnabled] = useState(true);
  const [onlinePayEnabled, setOnlinePayEnabled] = useState(true);
  const [shippingFlatFee, setShippingFlatFee] = useState("99");
  const [freeShippingAbove, setFreeShippingAbove] = useState("2500");

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site-config");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setBusinessName(data.businessName || "PureGrid Systems");
          setTagline(data.tagline || "");
          setPhone(data.phone || "+91 98765 43210");
          setWhatsapp(data.whatsapp || "919876543210");
          setEmail(data.email || "contact@puregridsystems.in");
          setAddress(data.address || "");
          setServiceCities(data.serviceCities || "");
          setHeroTitle(data.heroTitle || "");
          setHeroSubtitle(data.heroSubtitle || "");
          setHeroBannerUrl(data.heroBannerUrl || "");
          setRoBannerUrl(data.roBannerUrl || "");
          setSolarBannerUrl(data.solarBannerUrl || "");
          setCodEnabled(data.codEnabled ?? true);
          setOnlinePayEnabled(data.onlinePayEnabled ?? true);
          setShippingFlatFee(data.shippingFlatFee?.toString() || "99");
          setFreeShippingAbove(data.freeShippingAbove?.toString() || "2500");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      businessName,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      serviceCities,
      heroTitle,
      heroSubtitle,
      heroBannerUrl,
      roBannerUrl,
      solarBannerUrl,
      codEnabled,
      onlinePayEnabled,
      shippingFlatFee: parseFloat(shippingFlatFee) || 0,
      freeShippingAbove: parseFloat(freeShippingAbove) || 0,
    };

    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save site configuration");

      // Notify customer-side context across current window and other tabs
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("site-config-updated"));
        try {
          localStorage.setItem("site-config-sync", Date.now().toString());
        } catch (_) {}
      }

      setFeedback({
        type: "success",
        text: "Storefront configuration saved! Changes are now live on the customer-facing website.",
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to update configuration." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Storefront CMS & Operations Config</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Site CMS & Live Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control brand headlines, support hotlines, delivery fee rules, and banners displayed across the public customer website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchConfig}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reload Config"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Preview Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-bold">{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Brand & Slogan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#0284C7]" />
            <span>Brand Identity & Business Meta</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Hotlines & Customer Support */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-[#0284C7]" />
            <span>Customer Contact Hotlines & Support Lines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Toll-Free Helpline Phone
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Business Number (digits only)
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="919876543210"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Coverage Badge
              </label>
              <input
                type="text"
                value={serviceCities}
                onChange={(e) => setServiceCities(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Hero Section CMS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-[#0284C7]" />
            <span>Storefront Hero & Section Copy</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Homepage Hero Title
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Homepage Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Background Banner
              </label>
              <input
                type="text"
                value={heroBannerUrl}
                onChange={(e) => setHeroBannerUrl(e.target.value)}
                placeholder="/images/hero/..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Commercial RO Page Banner
              </label>
              <input
                type="text"
                value={roBannerUrl}
                onChange={(e) => setRoBannerUrl(e.target.value)}
                placeholder="/images/commercial/..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Residential Solar Page Banner
              </label>
              <input
                type="text"
                value={solarBannerUrl}
                onChange={(e) => setSolarBannerUrl(e.target.value)}
                placeholder="/images/solar/..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: E-Commerce & Checkout Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Truck className="w-4 h-4 text-[#0284C7]" />
            <span>E-Commerce, Freight & Payment Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-[#0284C7] focus:ring-0"
                />
                <span className="font-bold text-slate-900">Enable Cash on Delivery (COD)</span>
              </label>
              <p className="text-[11px] text-slate-500 pl-6">
                Allows customers to place spares orders and pay on delivery at their doorstep.
              </p>

              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={onlinePayEnabled}
                  onChange={(e) => setOnlinePayEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-[#0284C7] focus:ring-0"
                />
                <span className="font-bold text-slate-900">Enable Online Razorpay Gateway</span>
              </label>
              <p className="text-[11px] text-slate-500 pl-6">
                Accepts UPI, Netbanking, Credit & Debit Cards with instant automated order confirmation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Flat Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={shippingFlatFee}
                  onChange={(e) => setShippingFlatFee(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={freeShippingAbove}
                  onChange={(e) => setFreeShippingAbove(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Orders exceeding this amount automatically waive the shipping fee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm sticky bottom-4 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All modifications sync directly to the public customer site.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing Updates..." : "Save & Publish Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
