import React from "react";
import { Package, Filter } from "lucide-react";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      {/* Title & Search Header Skeleton */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="w-48 h-4 rounded shimmer-mask"></div>
            <div className="w-72 sm:w-96 h-8 rounded-lg shimmer-mask"></div>
            <div className="w-64 sm:w-80 h-4 rounded shimmer-mask"></div>
          </div>
          <div className="w-full md:w-80 h-10 rounded-lg shimmer-mask"></div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-[#E2E8F0]">
          <div className="w-24 h-5 rounded shimmer-mask"></div>
          <div className="w-28 h-7 rounded-lg shimmer-mask"></div>
          <div className="w-32 h-7 rounded-lg shimmer-mask"></div>
          <div className="w-28 h-7 rounded-lg shimmer-mask"></div>
        </div>
      </div>

      {/* Grid of 8 Product Card Skeletons with Grey Shimmer Masks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs"
          >
            {/* Image Placeholder Grey Mask */}
            <div className="aspect-square shimmer-mask border-b border-[#E2E8F0]"></div>

            {/* Card Content Grey Masks */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-16 h-3 rounded shimmer-mask"></div>
                <div className="w-full h-4 rounded shimmer-mask"></div>
                <div className="w-3/4 h-3 rounded shimmer-mask"></div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="w-24 h-5 rounded shimmer-mask"></div>
                <div className="w-20 h-7 rounded-lg shimmer-mask"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
