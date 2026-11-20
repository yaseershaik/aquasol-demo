import Link from "next/link";
import { LayoutDashboard, ShieldAlert, Droplets, Sun } from "lucide-react";

export default function AdminNotFound() {
  return (
    <>
      <style>{`
        header, nav, footer {
          display: none !important;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#D97706] p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center gap-1">
                <Droplets className="w-5 h-5 text-sky-400" />
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-2">
              AQUASOL Administration Console
            </span>
          </div>

          <div className="space-y-2 py-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
              Error 404 &bull; Module Not Found
            </span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">404</h1>
            <h2 className="text-base font-bold text-slate-800">Panel or Route Not Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              The administrative module you requested does not exist or has been relocated in the system registry.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin"
              className="w-full py-3 px-4 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Back to Operations Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
