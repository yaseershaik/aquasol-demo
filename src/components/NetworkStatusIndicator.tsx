"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, CheckCircle2 } from "lucide-react";

export default function NetworkStatusIndicator() {
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!mounted || (!isOffline && !showRestored)) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      {isOffline ? (
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-semibold">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span>Slow or disconnected internet. Showing cached resources.</span>
        </div>
      ) : showRestored ? (
        <div className="bg-emerald-950/90 text-emerald-100 backdrop-blur-md px-4 py-2.5 rounded-full border border-emerald-700/80 shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Connection restored &bull; Live sync active</span>
        </div>
      ) : null}
    </div>
  );
}
