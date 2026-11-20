import Link from "next/link";
import { Droplets, Sun, Home, Package, ArrowLeft, PhoneCall } from "lucide-react";

export default function NotFound() {
  return (
    <>
      {/* Hide header, navigation bar, and footer on 404 error page */}
      <style>{`
        header, nav, footer {
          display: none !important;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center justify-center">
            <Link href="/" className="inline-flex flex-col items-center group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#D97706] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center gap-1">
                  <Droplets className="w-5 h-5 text-sky-400" />
                  <Sun className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="flex items-center leading-none mt-2.5">
                <span className="text-2xl font-black text-[#0284C7] tracking-tight">AQUA</span>
                <span className="text-2xl font-black text-[#D97706] tracking-tight">SOL</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                PureGrid Systems
              </span>
            </Link>
          </div>

          {/* 404 Large Visual Badge */}
          <div className="space-y-2 py-2">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
              Error 404 &bull; Not Found
            </span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight">
              4<span className="text-[#0284C7]">0</span>4
            </h1>
            <h2 className="text-lg font-bold text-slate-800">
              Page or Link Not Found
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              The URL you entered does not exist or has been relocated. Please check the spelling or return to the main portal.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              href="/"
              className="w-full py-3 px-4 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Home className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/products"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-[#0284C7]" />
              <span>Browse Spare Parts Catalog</span>
            </Link>
          </div>

          {/* Footer Contact Help */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
            <span>Need assistance? Helpline:</span>
            <a href="tel:18008902847" className="font-bold text-[#0284C7] hover:underline">
              1800-890-2847
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
