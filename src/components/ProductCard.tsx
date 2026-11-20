"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import {
  Package,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Sun,
} from "lucide-react";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    vertical: string;
    shortSummary: string;
    price: number;
    compareAtPrice?: number | null;
    gstPercent: number;
    stockQuantity: number;
    images?: string;
    category?: {
      name: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  let imageUrl: string | null = null;
  try {
    if (product.images) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
        imageUrl = parsed[0];
      }
    }
  } catch {
    // fallback
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isRo = product.vertical === "RO";

  return (
    <div className="hover-lift group flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl hover:border-[#0284C7] transition-all overflow-hidden shadow-sm">
      {/* Product Image Area with Shimmer Mask Lazy Load */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-slate-100 shimmer-mask border-b border-[#E2E8F0] overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = isRo ? "/images/real/ro-membrane-4040.jpg" : "/images/real/monocrystalline-panel.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
            <Package className="w-12 h-12 stroke-[1.2] mb-2 text-slate-300" />
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              {isRo ? "AquaSol RO Component" : "AquaSol Solar Hardware"}
            </span>
          </div>
        )}

        {/* Live Stock Status Pill */}
        <div className="absolute top-2.5 left-2.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              In Stock ({product.stockQuantity})
            </span>
          )}
        </div>

        {/* Business Vertical Tag (Aqua vs Sol) */}
        <div className="absolute top-2.5 right-2.5">
          {isRo ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 rounded-md">
              <Droplets className="w-3 h-3 text-[#0284C7]" /> Commercial RO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 rounded-md">
              <Sun className="w-3 h-3 text-[#D97706]" /> Solar Power
            </span>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span className="font-mono">SKU: {product.sku}</span>
            {product.category && (
              <span className="text-slate-600 font-semibold">{product.category.name}</span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#0284C7] transition-colors">
            <h3 className="text-base font-bold text-[#0F172A] line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1.5 text-xs text-[#475569] line-clamp-2 leading-relaxed">
            {product.shortSummary}
          </p>
        </div>

        {/* Price & Purchase Actions */}
        <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#0F172A]">
                  {formatINR(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Incl. {product.gstPercent}% GST
              </span>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="text-xs font-semibold text-[#0284C7] inline-flex items-center hover:underline"
            >
              Specs <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
