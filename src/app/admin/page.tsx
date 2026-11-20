import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import {
  Package,
  ShoppingCart,
  CalendarCheck,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Settings,
  Globe,
  ExternalLink,
  Droplet,
  Sun,
  Truck,
  Users,
  Eye,
  Activity,
  Layers,
  Droplets,
} from "lucide-react";

export const revalidate = 0; // Live metrics

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch live counts and aggregates
  const [
    totalProducts,
    outOfStockProducts,
    totalOrders,
    ordersRevenue,
    pendingOrders,
    completedOrders,
    pendingBookings,
    openLeads,
    recentOrders,
    recentBookings,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stockQuantity: { lte: 0 } } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { orderStatus: { in: ["PLACED", "CONFIRMED", "PACKED"] } } }),
    prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    prisma.inspectionBooking.count({ where: { status: "PENDING" } }),
    prisma.leadQuote.count({ where: { status: "NEW" } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.inspectionBooking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = ordersRevenue._sum.totalAmount || 0;

  const quickStorefrontShortcuts = [
    {
      title: "Public Storefront Home",
      path: "/",
      icon: Globe,
      color: "from-sky-600 to-blue-600",
      desc: "Hero banners, TDS advisor, PM Surya Ghar subsidy tool, featured equipment.",
    },
    {
      title: "Commercial RO Solutions",
      path: "/commercial-ro",
      icon: Droplets,
      color: "from-cyan-600 to-sky-600",
      desc: "Turnkey skids (250-50,000 LPH), plant sizing specs, survey booking form.",
    },
    {
      title: "Residential Solar Systems",
      path: "/residential-solar",
      icon: Sun,
      color: "from-amber-500 to-orange-600",
      desc: "PM Surya Ghar subsidy eligibility, Tier-1 Mono PERC panels, payback calculator.",
    },
    {
      title: "Products & Spares Catalog",
      path: "/products",
      icon: Package,
      color: "from-blue-600 to-indigo-600",
      desc: "Full equipment & replacement parts store with vertical category filters.",
    },
    {
      title: "Live Order Tracking Portal",
      path: "/track-order",
      icon: Truck,
      color: "from-purple-600 to-blue-600",
      desc: "Real-time courier status and milestone tracking for customer self-service.",
    },
    {
      title: "Customer Account Portal",
      path: "/account",
      icon: Users,
      color: "from-sky-600 to-teal-600",
      desc: "Customer dashboard, past orders, survey status, and B2B GST profiles.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
            <span>AQUASOL Operations & Dispatch Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineering & Logistics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <span className="text-slate-800 font-mono font-semibold">{session.email}</span> &bull; Pan-India Dispatch & Engineering Portal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/explorer"
            className="px-3.5 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Storefront Hub</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Add SKU</span>
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Site CMS</span>
          </Link>
        </div>
      </div>

      {/* Out of Stock Warning Banner */}
      {outOfStockProducts > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong className="text-rose-900 font-bold">Inventory Alert:</strong> {outOfStockProducts} catalog product(s) have 0 stock units and are currently marked &quot;Out of Stock&quot; on the public customer storefront.
            </span>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline shrink-0 ml-4 transition-colors"
          >
            Review & Restock &rarr;
          </Link>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gross Revenue
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono tracking-tight">
            {formatINR(totalRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold">
              +14.8%
            </span>
            <span>vs previous period &bull; Pan-India orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalOrders}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-amber-700 font-bold">{pendingOrders} in fulfillment</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-bold">{completedOrders} delivered</span>
          </div>
        </div>

        {/* Site Inspections */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Site Surveys & Leads
            </span>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[#D97706]">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono tracking-tight">
            {pendingBookings + openLeads}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-amber-700 font-bold">{pendingBookings} pending surveys</span>
            <span>&bull;</span>
            <span className="text-[#0284C7] font-bold">{openLeads} new quotes</span>
          </div>
        </div>

        {/* Products in Catalog */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Catalog SKUs
            </span>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalProducts}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold">{totalProducts - outOfStockProducts} in stock</span>
            {outOfStockProducts > 0 && (
              <>
                <span>&bull;</span>
                <span className="text-rose-700 font-bold">{outOfStockProducts} zero-stock</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Customer Website Access Launchpad */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0284C7] flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Direct Customer Website Access & Controls</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jump directly into customer-facing applications, interactive calculators, and customer portals.
            </p>
          </div>
          <Link
            href="/admin/explorer"
            className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
          >
            <span>Open Simulator Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStorefrontShortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.path}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#0284C7] transition-all group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sc.color} flex items-center justify-center text-white shadow-xs`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {sc.path}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {sc.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <Link
                    href={`/admin/explorer`}
                    className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </Link>
                  <a
                    href={sc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>Visit Live</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Real-Time Telemetry Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Stream */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#0284C7]" />
                <span>Recent Customer Orders</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Latest orders received from customer checkout
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="pb-2 font-semibold">Order #</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-800">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-500">{ord.city}, {ord.state}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {formatINR(ord.totalAmount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            ord.orderStatus === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : ord.orderStatus === "SHIPPED"
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/admin/orders"
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-200"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Site Inspections Stream */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#D97706]" />
                <span>Recent Survey Bookings</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                On-site engineering inspections for Solar & RO
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="pb-2 font-semibold">Service</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Technician</th>
                  <th className="pb-2 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No inspection bookings submitted yet.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.serviceType === "COMMERCIAL_RO"
                              ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {b.serviceType === "COMMERCIAL_RO" ? "RO Skid" : "Solar"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500">{b.city}</div>
                      </td>
                      <td className="py-3 font-mono text-slate-700">
                        {b.preferredDate}
                      </td>
                      <td className="py-3 text-slate-600">
                        {b.assignedTech ? (
                          <span className="text-slate-800 font-semibold">{b.assignedTech}</span>
                        ) : (
                          <span className="text-amber-700 font-semibold text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
