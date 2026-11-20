"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  category: "all" | "ro" | "solar" | "spares";
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "f1",
    category: "solar",
    question: "How does the PM Surya Ghar ₹78,000 DBT subsidy work?",
    answer: "Under the PM Surya Ghar Muft Bijli Yojana, residential households installing rooftop solar receive a direct bank transfer (DBT) subsidy of ₹30,000 for 1 kW, ₹60,000 for 2 kW, and a maximum of ₹78,000 for 3 kW and above. AquaSol handles the complete paperwork: site shadow analysis, DISCOM net-metering feasibility, ALMM-compliant panel commissioning, and direct portal claim filing so the subsidy is deposited into your registered bank account within 30 days of meter installation.",
  },
  {
    id: "f2",
    category: "ro",
    question: "What raw water TDS levels can AquaSol Commercial RO Plants treat?",
    answer: "Our custom skid-mounted commercial RO systems are engineered to handle raw borewell and brackish water TDS levels ranging from 400 PPM up to 4,500+ PPM. Every unit includes matched multi-media sand/carbon pre-filtration and antiscalant metering dosing to protect DuPont Filmtec and Toray membranes, achieving consistent 99%+ salt rejection and permeate output compliant with IS 10500 drinking standards.",
  },
  {
    id: "f3",
    category: "spares",
    question: "Are spare parts genuine OEM items, and do they include GST invoices?",
    answer: "Yes, 100%. Every commercial membrane element, Grundfos pump, Pentair FRP vessel, and solar inverter sold through our storefront is factory-sealed with verifiable manufacturer serial numbers. We issue compliant B2B tax invoices with clear 18% or 12% GST breakdowns and dispatch via express surface cargo with protective wooden crating and online tracking.",
  },
  {
    id: "f4",
    category: "ro",
    question: "How quickly can a service engineer inspect our commercial facility?",
    answer: "Our regional engineering hubs in Visakhapatnam, Vijayawada, Hyderabad, and Tirupati maintain dedicated mobile service vans. Site inspection requests are scheduled within 24 to 48 hours. The engineer arrives with portable calibrated TDS/pH meters to conduct on-site water quality analysis, inspect piping hydraulics, and provide an instant technical survey report.",
  },
  {
    id: "f5",
    category: "solar",
    question: "How much roof space is required for a 3 kW or 5 kW solar plant?",
    answer: "Because we deploy high-efficiency 540W+ monocrystalline bifacial solar panels, space requirements are minimal. A 3 kW system requires approximately 280 to 320 sq. ft. of shadow-free rooftop area. A 5 kW system requires approximately 450 to 500 sq. ft. Our elevated galvanized mounting structures ensure full roof usability underneath.",
  },
  {
    id: "f6",
    category: "spares",
    question: "What is your policy for out-of-stock components?",
    answer: "Our store enforces strict live inventory tracking: out-of-stock items cannot be added to cart. If a specific component (such as an industrial inverter) is currently reserved, you can request an instant quotation, and our warehouse team will allocate the incoming consignment directly to your account.",
  },
];

export default function FaqSection() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ro" | "solar" | "spares">("all");
  const [openId, setOpenId] = useState<string | null>("f1");

  const filteredFaqs = selectedCategory === "all"
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-[#0284C7]" /> Knowledge Base
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#475569]">
          Straightforward answers regarding technical specifications, DBT subsidies, and logistics.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center space-x-1.5 mb-8 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Topics" },
          { id: "ro", label: "Commercial RO Plants" },
          { id: "solar", label: "Solar & Subsidy" },
          { id: "spares", label: "Spare Parts & Shipping" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              selectedCategory === tab.id
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0F172A] hover:bg-slate-50 transition"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#0284C7]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
