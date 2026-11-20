import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  Filter,
  Package,
  RefreshCw,
  Droplets,
  Sun,
} from "lucide-react";

export const revalidate = 0; // Live stock & pricing

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const verticalParam = typeof resolvedParams.vertical === "string" ? resolvedParams.vertical : undefined;
  const categoryParam = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const searchQuery = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : undefined;

  const where: any = { isPublished: true };

  if (verticalParam && (verticalParam === "RO" || verticalParam === "SOLAR")) {
    where.vertical = verticalParam;
  }

  if (categoryParam) {
    where.category = { slug: categoryParam };
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { sku: { contains: searchQuery } },
      { shortSummary: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: verticalParam ? { vertical: verticalParam } : undefined,
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ stockQuantity: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Title & Search Header */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Package className="w-3.5 h-3.5 text-[#0284C7]" /> AquaSol Genuine Components
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Industrial Spare Parts Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1">
              Authentic membranes, high-pressure pumps, FRP vessels, and solar inverters with live inventory tracking.
            </p>
          </div>

          {/* Search Form */}
          <form method="GET" action="/products" className="w-full md:w-80 flex items-center">
            {verticalParam && <input type="hidden" name="vertical" value={verticalParam} />}
            {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
            <div className="relative w-full">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery || ""}
                placeholder="Search by part name or SKU..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-lg bg-[#FFFFFF] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0284C7] shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>
        </div>

        {/* Filter Tabs: Vertical & Categories */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-[#E2E8F0]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#0284C7]" /> Filter Vertical:
          </span>

          <Link
            href="/products"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              !verticalParam
                ? "bg-[#0A192F] text-[#FFFFFF]"
                : "bg-slate-100 text-slate-600 hover:text-[#0F172A]"
            }`}
          >
            All Verticals
          </Link>

          <Link
            href="/products?vertical=RO"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 ${
              verticalParam === "RO"
                ? "bg-[#0284C7] text-[#FFFFFF] shadow-xs"
                : "bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
            }`}
          >
            <Droplets className="w-3 h-3" /> Commercial RO Spares
          </Link>

          <Link
            href="/products?vertical=SOLAR"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 ${
              verticalParam === "SOLAR"
                ? "bg-[#D97706] text-[#FFFFFF] shadow-xs"
                : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <Sun className="w-3 h-3" /> Solar Inverters & Hardware
          </Link>

          {/* Reset button if active filters */}
          {(verticalParam || categoryParam || searchQuery) && (
            <Link
              href="/products"
              className="ml-auto inline-flex items-center gap-1 text-xs text-[#DC2626] hover:underline font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </Link>
          )}
        </div>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 mr-1 font-medium">Categories:</span>
            {categories.map((cat) => {
              const isSelected = categoryParam === cat.slug;
              const href = verticalParam
                ? `/products?vertical=${verticalParam}&category=${cat.slug}`
                : `/products?category=${cat.slug}`;

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    isSelected
                      ? "border-[#0284C7] bg-[#0284C7] text-[#FFFFFF] font-bold shadow-xs"
                      : "border-[#CBD5E1] text-slate-600 hover:border-[#0284C7] hover:text-[#0284C7] bg-white"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-16 border border-[#E2E8F0] rounded-xl bg-slate-50 p-8 space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto stroke-[1.5]" />
          <h3 className="text-lg font-bold text-[#0F172A]">No components found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No items matched your current filter or search criteria. Try removing filters or searching for generic terms like &quot;membrane&quot;, &quot;pump&quot;, or &quot;inverter&quot;.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="px-4 py-2 bg-[#0A192F] text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#0284C7]"
            >
              View All Components
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs text-slate-500 mb-4 font-medium">
            Showing <span className="font-bold text-[#0F172A]">{products.length}</span> components
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
