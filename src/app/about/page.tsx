import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  Droplets, 
  Sun, 
  CheckCircle2, 
  Building2, 
  Clock, 
  ArrowRight 
} from "lucide-react";

export const metadata = {
  title: "About Us | AquaSol Systems - Commercial RO Plants & Rooftop Solar",
  description: "Learn about AquaSol Systems, our ISO 9001:2015 engineering standards, fabrication facilities, and regional service hubs across Andhra Pradesh and Telangana.",
};

export default function AboutPage() {
  const milestones = [
    {
      year: "2016",
      title: "Company Founded",
      description: "Started with custom commercial RO skids in Visakhapatnam to solve high-salinity borewell water challenges for coastal food processors."
    },
    {
      year: "2019",
      title: "Solar Division Integration",
      description: "Expanded into commercial rooftop solar and micro-inverter grid synchronization, enabling solar-powered water purification plants."
    },
    {
      year: "2022",
      title: "ISO 9001:2015 Certification",
      description: "Achieved global quality certification for skidded RO fabrication, electrical panel wiring, and on-site predictive maintenance."
    },
    {
      year: "2024",
      title: "PM Surya Ghar & Regional Expansion",
      description: "Empaneled for direct DBT solar subsidy installations across AP and TS Discoms, crossing 500+ commercial and residential projects."
    }
  ];

  const standards = [
    {
      icon: <Droplets className="w-6 h-6 text-aqua-600" />,
      title: "Industrial Grade Water Purity",
      desc: "Every RO plant is engineered to match IS 10500 drinking water norms and USP 43 pharma standards with high-rejection Dow membranes."
    },
    {
      icon: <Sun className="w-6 h-6 text-amber-600" />,
      title: "Tier-1 Solar Engineering",
      desc: "Bifacial monocrystalline panels, hot-dip galvanized mounting structures (150 km/h wind rated), and cloud-monitored inverters."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      title: "ISO 9001:2015 Quality Controls",
      desc: "Hydrostatic pressure testing at 1.5x operating bar, automated TDS cutoff solenoids, and factory electrical safety audits."
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: "24-Hour Regional Field Response",
      desc: "Mobile service engineers stationed across Visakhapatnam, Vijayawada, and Hyderabad equipped with genuine spares."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-700">
              <Award className="w-3.5 h-3.5" />
              ISO 9001:2015 Certified Engineering Firm
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pioneering Pure Water and Clean Solar Energy.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              AquaSol Systems is a dual-vertical industrial engineering firm. We design, fabricate, and maintain heavy-duty commercial RO water plants and deploy high-efficiency rooftop solar installations across Andhra Pradesh and Telangana.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="border-b border-slate-200 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-navy-950">500+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Industrial Plants Installed</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-aqua-600">3.5 MW+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Rooftop Solar Synchronized</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600">₹78,000</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Max PM Surya Ghar Subsidy</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-navy-950">&lt; 24 Hrs</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">On-Site Emergency Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Engineering Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-aqua-600 mb-2">Our Foundation</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Engineering Water Security & Energy Independence
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                In many industrial hubs, water salinity exceeds 2,500 PPM TDS while commercial grid power tariffs continue to escalate. We founded AquaSol Systems with a clear goal: solve both challenges with one trusted engineering partner.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-aqua-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-navy-950">In-House Skid Fabrication:</strong> SS-304 frames, automated sand & carbon dual-vessel media filtration, and digital PLC controllers.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-navy-950">Direct Discom Net-Metering:</strong> Seamless rooftop solar approvals and DBT subsidy clearance through APCPDCL, APEPDCL, and TGSPDCL.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-navy-950">OEM Direct Component Supply:</strong> Genuine Dow Filmtec membranes, Grundfos vertical pumps, and Growatt smart inverters stocked in our warehouses.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {standards.map((s, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="p-3 bg-white w-fit rounded-xl border border-slate-200 shadow-sm mb-4">
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-navy-950 text-base">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Our Growth Journey
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              From a single workshop in Visakhapatnam to an ISO-certified regional leader.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="text-2xl font-black text-aqua-600">{item.year}</span>
                <h3 className="font-bold text-navy-950 text-base mt-2">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Warehousing */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-navy-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-700">
                <Building2 className="w-3.5 h-3.5" />
                Engineering Infrastructure
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                12,000 Sq. Ft. Skid Fabrication & Spares Depot
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Our main facility in Auto Nagar, Visakhapatnam maintains a dedicated clean assembly line, computerized pump testing station, and temperature-controlled spare parts storage for RO membranes and solar balance-of-system equipment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-aqua-600 hover:bg-aqua-500 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Completed Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition"
                >
                  Schedule Facility Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
