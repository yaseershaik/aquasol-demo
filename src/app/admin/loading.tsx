import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="space-y-2">
          <div className="w-48 h-3.5 rounded shimmer-mask"></div>
          <div className="w-72 sm:w-96 h-8 rounded-lg shimmer-mask"></div>
          <div className="w-60 h-3.5 rounded shimmer-mask"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-24 h-8 rounded-lg shimmer-mask"></div>
          <div className="w-24 h-8 rounded-lg shimmer-mask"></div>
        </div>
      </div>

      {/* 4 KPI Card Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-24 h-3.5 rounded shimmer-mask"></div>
              <div className="w-8 h-8 rounded-lg shimmer-mask"></div>
            </div>
            <div className="w-32 h-7 rounded shimmer-mask"></div>
            <div className="w-40 h-3 rounded shimmer-mask"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton with Grey Masks */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="w-48 h-5 rounded shimmer-mask"></div>
          <div className="w-20 h-4 rounded shimmer-mask"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100/60 last:border-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg shimmer-mask"></div>
                <div className="space-y-1.5">
                  <div className="w-36 h-4 rounded shimmer-mask"></div>
                  <div className="w-24 h-3 rounded shimmer-mask"></div>
                </div>
              </div>
              <div className="w-20 h-4 rounded shimmer-mask"></div>
              <div className="w-16 h-6 rounded-md shimmer-mask"></div>
              <div className="w-14 h-6 rounded-md shimmer-mask"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
