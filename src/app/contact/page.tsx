"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2, 
  Send 
} from "lucide-react";

export default function ContactPage() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vertical: "COMMERCIAL_RO",
    inquiryType: "SALES",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hubs = [
    {
      city: `${config.businessName || "PureGrid Systems"} (Headquarters & Works)`,
      address: config.address || "Plot 48/A, Auto Nagar Industrial Estate, Gajuwaka, Visakhapatnam, AP - 530012",
      phone: config.phone || "+91 891 278 4321",
      email: config.email || "vizag@aquasolsystems.com",
      coverage: config.serviceCities || "Coastal AP, Port logistics, Hatcheries, Pharma City"
    },
    {
      city: "Vijayawada & Guntur Hub",
      address: "Near Benz Circle, Ring Road, Vijayawada, AP - 520008",
      phone: "+91 866 245 9876",
      email: "vijayawada@aquasolsystems.com",
      coverage: "Agro processing, Cold storage, Commercial rooftop solar"
    },
    {
      city: "Hyderabad Regional Hub",
      address: "Plot 12, IDA Mallapur, Nacharam Industrial Area, Hyderabad, TS - 500076",
      phone: "+91 40 2717 6543",
      email: "hyderabad@aquasolsystems.com",
      coverage: "Telangana industrial corridors, Bulk drug labs, IT parks"
    },
    {
      city: "Tirupati Regional Center",
      address: "Renigunta Road, Tirupati, AP - 517501",
      phone: "+91 877 223 1190",
      email: "tirupati@aquasolsystems.com",
      coverage: "Rayalaseema, Food packaging, Residential rooftop solar"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-700">
              <Clock className="w-3.5 h-3.5" />
              Rapid Regional Dispatch & Support
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Get in Touch with Our Engineers.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Whether you need an industrial RO plant quotation, a rooftop solar feasibility assessment, emergency spare parts dispatch, or technician breakdown support, we are here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Alert */}
      <section className="bg-amber-500 text-slate-950 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-950 text-amber-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <p className="font-extrabold text-sm sm:text-base leading-none">24/7 RO Plant Emergency Breakdown Dispatch</p>
              <p className="text-xs text-slate-900 mt-0.5">High TDS alarms, pump cavitation, membrane fouling, or sudden pressure drops.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${config.phone.replace(/\s+/g, "")}`}
              className="px-4 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition"
            >
              Call {config.phone}
            </a>
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Regional Hubs */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Form (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-950 tracking-tight">Send Us a Direct Message</h2>
              <p className="mt-1 text-xs text-slate-600">
                Our application engineering team will review and reply within 4 business hours.
              </p>

              {submitted ? (
                <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-base">Inquiry Dispatched Successfully</h3>
                  <p className="text-xs text-emerald-700">
                    Thank you! Our technical specialist will contact you at <strong>{formData.phone || formData.email}</strong> promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-emerald-800 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Suresh Kumar"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="suresh@company.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        System Vertical
                      </label>
                      <select
                        value={formData.vertical}
                        onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
                      >
                        <option value="COMMERCIAL_RO">Commercial RO Plant</option>
                        <option value="RESIDENTIAL_SOLAR">Rooftop Solar Plant</option>
                        <option value="SPARE_PARTS">Spare Parts / Consumables</option>
                        <option value="EMERGENCY">Emergency Breakdown</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Inquiry Nature
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-aqua-500 outline-none"
                      >
                        <option value="SALES">New Plant Pricing</option>
                        <option value="MAINTENANCE">AMC / Servicing</option>
                        <option value="TECHNICAL">Datasheet & Water Test</option>
                        <option value="PARTNERSHIP">Dealer / Subcontractor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Project Details / Water TDS / Bill Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention your required capacity (e.g. 5,000 LPH or 10 kW solar), raw water source, or current monthly electricity bill..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-aqua-500 outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-navy-950 hover:bg-navy-900 text-white font-semibold rounded-xl text-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Technical Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Regional Hubs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-aqua-600 mb-1">Regional Presence</div>
                <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                  Operating Hubs Across Andhra Pradesh & Telangana
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Every hub is staffed with factory-trained field technicians, rapid response vans, and critical spare parts inventory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hubs.map((hub, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-navy-950 text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-aqua-600 flex-shrink-0" />
                        <span>{hub.city}</span>
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {hub.address}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 text-xs space-y-1.5 text-slate-700">
                      <p>
                        <strong>Phone:</strong> {hub.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {hub.email}
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1">
                        <strong>Coverage:</strong> {hub.coverage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Booking Shortcut */}
              <div className="p-6 bg-aqua-50 border border-aqua-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-navy-950 text-sm">Need an On-Site Water Purity or Rooftop Survey?</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Pick a specific date and time slot for our engineer to visit your premises.</p>
                </div>
                <Link
                  href="/commercial-ro#book-inspection"
                  className="px-5 py-2.5 bg-aqua-600 hover:bg-aqua-700 text-white rounded-xl text-xs font-bold transition flex-shrink-0 shadow-sm"
                >
                  Schedule Site Survey
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
