import React from "react";
import Link from "next/link";
import InspectionForm from "@/components/InspectionForm";
import QuoteLeadForm from "@/components/QuoteLeadForm";
import QuickSubsidyCalculator from "@/components/QuickSubsidyCalculator";
import {
  Sun,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingDown,
  Calculator,
  Building,
  ArrowRight,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Residential Rooftop Solar & PM Surya Ghar Subsidy (₹78,000) | AquaSol Systems",
  description:
    "Turnkey on-grid rooftop solar installations (1 to 10 kW) by AquaSol with PM Surya Ghar Muft Bijli Yojana central subsidy support of up to ₹78,000 and AP Discom net-metering.",
};

export default function ResidentialSolarPage() {
  const solarTiers = [
    {
      capacity: "2 kW System",
      dailyGeneration: "8 - 9 Units / Day",
      monthlySavings: "Approx. ₹2,000 - ₹2,400 / month",
      subsidy: "₹60,000 Direct Subsidy",
      roofArea: "200 sq. ft. shadow-free",
      bestFor: "Small 1-2 BHK Homes (Fans, TV, Refrigerator, LED lighting)",
    },
    {
      capacity: "3 kW System (Most Popular)",
      dailyGeneration: "12 - 14 Units / Day",
      monthlySavings: "Approx. ₹3,200 - ₹4,000 / month",
      subsidy: "₹78,000 Max Subsidy",
      roofArea: "300 - 350 sq. ft. shadow-free",
      bestFor: "Standard 3 BHK Homes (1 AC, Refrigerator, Washing Machine, Pumps)",
    },
    {
      capacity: "5 kW System",
      dailyGeneration: "20 - 24 Units / Day",
      monthlySavings: "Approx. ₹5,500 - ₹7,000 / month",
      subsidy: "₹78,000 Max Subsidy",
      roofArea: "500 - 600 sq. ft. shadow-free",
      bestFor: "Large Duplex Homes / Independent Villas (2-3 ACs, EV Charging)",
    },
    {
      capacity: "10 kW System",
      dailyGeneration: "40 - 45 Units / Day",
      monthlySavings: "Approx. ₹11,000 - ₹14,000 / month",
      subsidy: "₹78,000 Max Subsidy",
      roofArea: "1,000+ sq. ft. shadow-free",
      bestFor: "Commercial Villas, Multi-Family Homes, EV Fast Charging",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFFBEB]/70 via-[#FFFFFF] to-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider text-amber-900">
              <Sun className="w-3.5 h-3.5 text-[#D97706]" />
              AQUASOL • Rooftop Clean Energy & Central Subsidies
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Turnkey Rooftop Solar with ₹78,000 PM Surya Ghar Subsidy
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              Slash your monthly electricity bills to zero with grid-connected rooftop solar. 
              AquaSol manages every step: DISCOM net-metering approvals, MNRE subsidy disbursement directly to your bank account, and 25-year guaranteed panel performance.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#book-inspection"
                className="btn-interactive px-5 py-3 bg-[#D97706] hover:bg-[#B45309] text-[#FFFFFF] text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Schedule Rooftop Feasibility Survey
              </a>
              <a
                href="#subsidy-guide"
                className="btn-interactive px-5 py-3 border border-[#D97706] text-[#D97706] hover:bg-amber-50 text-sm font-semibold rounded-lg transition-colors"
              >
                PM Surya Ghar Subsidy Matrix
              </a>
              <Link
                href="/products?vertical=SOLAR"
                className="btn-interactive px-5 py-3 bg-[#F8FAFC] hover:bg-slate-200 text-[#0F172A] border border-[#CBD5E1] text-sm font-semibold rounded-lg transition-colors"
              >
                Solar Inverters & Components
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PM Surya Ghar Subsidy Breakdown Banner */}
      <section id="subsidy-guide" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="bg-[#0A192F] text-[#FFFFFF] rounded-2xl p-8 sm:p-12 space-y-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 text-[#F59E0B]">
            <Award className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Government of India Initiative • MNRE Facilitated
            </span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FFFFFF]">
              PM Surya Ghar: Muft Bijli Yojana Central Subsidy
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Residential consumers are eligible for direct bank transfer (DBT) central financial assistance. AquaSol executes the DISCOM registration and national portal subsidy claim on your behalf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">1 kW System</span>
              <p className="text-3xl font-black text-[#F59E0B]">₹30,000</p>
              <p className="text-xs text-slate-300">Fixed central subsidy credited to homeowner bank account.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">2 kW System</span>
              <p className="text-3xl font-black text-[#F59E0B]">₹60,000</p>
              <p className="text-xs text-slate-300">Fixed central subsidy credited to homeowner bank account.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">3 kW to 10 kW</span>
              <p className="text-3xl font-black text-[#F59E0B]">₹78,000</p>
              <p className="text-xs text-slate-300">Maximum allowable central financial assistance under current policy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Sizing & Generation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-b border-[#E2E8F0] pb-4 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
            <Calculator className="w-3.5 h-3.5" /> Generation & ROI
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Residential Solar Packages & Financial Returns
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Engineered with Tier-1 Mono PERC Bifacial Solar PV Modules and IP65 Smart Grid-Tied Inverters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solarTiers.map((tier, idx) => (
            <div
              key={idx}
              className="hover-lift bg-[#FFFFFF] border border-amber-100 hover:border-[#D97706] rounded-xl p-6 flex flex-col justify-between shadow-xs transition-all"
            >
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                  Solar Tier 0{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-[#0F172A]">{tier.capacity}</h3>
                <p className="text-xs text-[#475569]">
                  <strong className="text-[#0F172A]">Ideal For:</strong> {tier.bestFor}
                </p>

                <div className="pt-3 border-t border-amber-100 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Daily Power:</span>
                    <p className="font-bold text-[#0F172A]">{tier.dailyGeneration}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Monthly Savings:</span>
                    <p className="font-bold text-[#0F172A]">{tier.monthlySavings}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Direct Subsidy:</span>
                    <p className="font-bold text-emerald-700">{tier.subsidy}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Roof Space:</span>
                    <p className="font-bold text-[#0F172A]">{tier.roofArea}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-100">
                <a
                  href="#custom-quote"
                  className="w-full inline-flex items-center justify-center py-2.5 px-3 bg-[#D97706] hover:bg-[#B45309] text-[#FFFFFF] text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Get Feasibility Report
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AP Discom Net Metering Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FFFFFF] border border-amber-200 rounded-2xl p-8 sm:p-12 space-y-8 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
              <Zap className="w-3.5 h-3.5" /> Bi-Directional Grid
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              How Net Metering Works with Your Electricity Board
            </h2>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl">
              Your solar system sends excess power back into the grid during peak daytime sun. At night, you draw power back with full credit on your monthly bill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#FFFFFF] border border-amber-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#D97706]">STEP 01</span>
              <h3 className="text-base font-bold text-[#0F172A]">Roof & Load Audit</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Engineer conducts shadow path analysis using digital clinometer and checks sanctioned connected load on your electricity bill.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-amber-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#D97706]">STEP 02</span>
              <h3 className="text-base font-bold text-[#0F172A]">DISCOM Feasibility</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                AquaSol files the technical application with APCPDCL / APSPDCL / TSSPDCL for net-metering technical clearance.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-amber-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#D97706]">STEP 03</span>
              <h3 className="text-base font-bold text-[#0F172A]">Certified Installation</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Mounting of 150 km/h wind-rated hot-dip galvanized structures, Tier-1 panels, lightning arrestor, and dedicated dual chemical earthing.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-amber-100 p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold font-mono text-[#D97706]">STEP 04</span>
              <h3 className="text-base font-bold text-[#0F172A]">Bi-Directional Meter</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                DISCOM officers inspect the plant, replace your legacy meter with a bi-directional smart net meter, and activate the feed-in tariff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Subsidy Calculator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <QuickSubsidyCalculator />
      </section>

      {/* Forms Section: Site Inspection & Custom Quote */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div id="book-inspection" className="scroll-mt-24">
          <InspectionForm defaultVertical="RESIDENTIAL_SOLAR" />
        </div>

        <div id="custom-quote" className="scroll-mt-24">
          <QuoteLeadForm vertical="RESIDENTIAL_SOLAR" />
        </div>
      </section>
    </div>
  );
}
