import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Package,
  ChevronRight,
  Droplets,
  Sun,
} from "lucide-react";

export const revalidate = 0; // Live stock status

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Parse images JSON
  let images: string[] = [];
  try {
    if (product.images) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) {
        images = parsed.filter((img) => typeof img === "string" && img.length > 0);
      }
    }
  } catch {
    // fallback
  }

  // Parse specifications JSON
  let specifications: Array<{ key: string; value: string }> = [];
  try {
    if (product.specifications) {
      const parsed = JSON.parse(product.specifications);
      if (Array.isArray(parsed)) {
        specifications = parsed.filter(
          (s) => s && typeof s.key === "string" && typeof s.value === "string"
        );
      }
    }
  } catch {
    // fallback
  }

  // Fetch related products in same vertical
  const relatedProducts = await prisma.product.findMany({
    where: {
      isPublished: true,
      vertical: product.vertical,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  const isOutOfStock = product.stockQuantity <= 0;
  const isRo = product.vertical === "RO";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#0284C7]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/products" className="hover:text-[#0284C7]">
          Parts Catalog
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link
          href={`/products?vertical=${product.vertical}`}
          className="hover:text-[#0284C7]"
        >
          {isRo ? "Commercial RO" : "Solar Power"}
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-[#0284C7]"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-[#0F172A] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery / Image Visual */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50/70 border border-[#E2E8F0] rounded-2xl flex items-center justify-center overflow-hidden p-6 shadow-xs">
            {images.length > 0 ? (
              <ProductImage
                src={images[0]}
                alt={product.name}
                fallbackSrc={isRo ? "/images/real/ro-membrane-4040.jpg" : "/images/real/monocrystalline-panel.jpg"}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-center text-slate-400 p-8">
                <Package className="w-20 h-20 stroke-[1] mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  AquaSol Certified Component
                </p>
                <p className="text-xs text-slate-400 mt-1">Direct OEM Specification</p>
              </div>
            )}
          </div>

          {/* Thumbnail list if multiple */}
          {images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 shrink-0 border border-[#CBD5E1] rounded-lg bg-slate-50 p-1 overflow-hidden"
                >
                  <ProductImage
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fallbackSrc={isRo ? "/images/real/ro-membrane-4040.jpg" : "/images/real/monocrystalline-panel.jpg"}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              {isRo ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 rounded-md">
                  <Droplets className="w-3.5 h-3.5 text-[#0284C7]" /> Commercial RO Hardware
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 rounded-md">
                  <Sun className="w-3.5 h-3.5 text-[#D97706]" /> Solar Power Hardware
                </span>
              )}
              <span className="text-xs text-slate-500 font-mono font-semibold">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
              {product.name}
            </h1>

            {product.category && (
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Category: <span className="text-[#0F172A]">{product.category.name}</span>
              </p>
            )}
          </div>

          {/* Pricing & GST Breakdown */}
          <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-1.5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#0F172A]">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  MRP {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Inclusive of {product.gstPercent}% Goods & Services Tax (GST). Tax credit available for registered business GSTIN.
            </p>
          </div>

          {/* Live Stock Status Guard */}
          <div className="pt-1">
            {isOutOfStock ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <div>
                  <p className="text-sm font-bold">Currently Out of Stock</p>
                  <p className="text-xs text-rose-700">
                    This component is temporarily sold out. Contact our sales desk for restock timeline.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-bold">In Stock & Ready for Dispatch</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-200/60 text-emerald-900 rounded-md">
                  {product.stockQuantity} units available
                </span>
              </div>
            )}
          </div>

          {/* Short Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Overview
            </h3>
            <p className="text-sm text-[#334155] leading-relaxed">
              {product.shortSummary}
            </p>
          </div>

          {/* Add to Cart with live stock enforcement */}
          <div className="pt-2">
            <AddToCartButton product={product} showQtySelector={true} />
          </div>

          {/* Dispatch & Assurance Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E2E8F0] text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0284C7] shrink-0" />
              <span>Ships within 24-48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>OEM Manufacturer Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transit Insurance Covered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Specifications Table */}
      <div className="pt-8 border-t border-[#E2E8F0] space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Technical Specifications & Operating Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered parameters verified against OEM laboratory data sheets.
          </p>
        </div>

        {specifications.length > 0 ? (
          <div className="border border-[#CBD5E1] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[#E2E8F0]">
                {specifications.map((spec, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-[#FFFFFF]" : "bg-slate-50/70"}
                  >
                    <td className="py-3 px-4 sm:px-6 font-bold text-[#0F172A] w-1/3 sm:w-1/4">
                      {spec.key}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-[#334155] font-medium">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 border border-[#E2E8F0] rounded-xl bg-slate-50 text-xs text-slate-500">
            Standard manufacturer technical specifications apply. Detailed PDF data sheet available upon request.
          </div>
        )}

        {/* Detailed Description */}
        <div className="pt-4 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
            Engineering Description
          </h3>
          <div className="text-sm text-[#334155] leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-xl border border-[#E2E8F0]">
            {product.description}
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E2E8F0] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Related Components & Spare Parts
            </h2>
            <Link
              href={`/products?vertical=${product.vertical}`}
              className="text-xs font-bold text-[#0284C7] hover:underline"
            >
              View All {isRo ? "RO Spares" : "Solar Hardware"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
