import React from "react";

export default function GlobalLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-150">
      <div className="w-64 h-8 rounded-lg shimmer-mask"></div>
      <div className="w-full max-w-xl h-4 rounded shimmer-mask"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-full aspect-video rounded-lg shimmer-mask"></div>
            <div className="w-3/4 h-5 rounded shimmer-mask"></div>
            <div className="w-full h-3 rounded shimmer-mask"></div>
            <div className="w-2/3 h-3 rounded shimmer-mask"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
