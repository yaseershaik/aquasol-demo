"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUser, clearAuthData, fetchCurrentProfile, UserProfile } from "@/lib/user-auth";
import { formatINR } from "@/lib/format";
import InvoiceModal from "@/components/InvoiceModal";
import { FileText } from "lucide-react";

interface OrderItemRecord {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  tax_percent: number;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  pincode: string;
  subtotal: number;
  tax_total: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  courier_name?: string;
  tracking_number?: string;
  created_at: string;
  items: OrderItemRecord[];
}

interface InspectionRecord {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  vertical: string;
  preferred_date: string;
  preferred_time_slot: string;
  address: string;
  pincode: string;
  status: string;
  assigned_technician?: string;
  technician_phone?: string;
  notes?: string;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inspections" | "profile">("overview");

  // Live data from Python API
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<OrderRecord | null>(null);

  // Edit profile state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    const cached = getStoredUser();
    if (!cached) {
      router.push("/auth/login?redirect=/account");
      return;
    }
    setUser(cached);
    setName(cached.name || "");
    setPhone(cached.phone || "");
    setCompanyName(cached.company_name || "");
    setGstin(cached.gstin || "");
    setAddress(cached.address || "");
    setCity(cached.city || "");
    setPincode(cached.pincode || "");

    const token = localStorage.getItem("aquasol_user_token");

    // Fetch live profile
    fetchCurrentProfile().then((fresh) => {
      if (fresh) {
        setUser(fresh);
        setName(fresh.name || "");
        setPhone(fresh.phone || "");
        setCompanyName(fresh.company_name || "");
        setGstin(fresh.gstin || "");
        setAddress(fresh.address || "");
        setCity(fresh.city || "");
        setPincode(fresh.pincode || "");
      }
      setLoading(false);
    });

    // Fetch user orders & inspections from Python FastAPI backend
    if (token) {
      setLoadingRecords(true);
      Promise.all([
        fetch("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (r) => {
            if (r.ok) {
              const data = await r.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
            // Fallback to Python if empty or 404
            const pyRes = await fetch("/api/py/orders/my-orders", {
              headers: { Authorization: `Bearer ${token}` },
            }).catch(() => null);
            return pyRes && pyRes.ok ? pyRes.json() : [];
          })
          .catch(() => []),
        fetch("/api/bookings/my-inspections", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (r) => {
            if (r.ok) {
              const data = await r.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
            // Fallback to Python if empty or 404
            const pyRes = await fetch("/api/py/bookings/my-inspections", {
              headers: { Authorization: `Bearer ${token}` },
            }).catch(() => null);
            return pyRes && pyRes.ok ? pyRes.json() : [];
          })
          .catch(() => []),
      ])
        .then(([ordersData, inspectionsData]) => {
          if (Array.isArray(ordersData)) setOrders(ordersData);
          if (Array.isArray(inspectionsData)) setInspections(inspectionsData);
        })
        .finally(() => {
          setLoadingRecords(false);
        });
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthData();
    router.push("/auth/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage(null);

    const token = localStorage.getItem("aquasol_user_token");
    try {
      const payload = {
        name,
        phone,
        company_name: companyName || null,
        companyName: companyName || null,
        gstin: gstin || null,
        address: address || null,
        city: city || null,
        pincode: pincode || null,
      };

      let res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 404) {
        res = await fetch("/api/py/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem("aquasol_user_profile", JSON.stringify(updated));
      setUpdateMessage("Profile updated successfully!");
    } catch {
      setUpdateMessage("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-aqua-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading customer account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Profile Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-white flex items-center justify-center text-2xl font-black shadow-md border border-navy-800">
              {user?.name?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-navy-950">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user?.role === "b2b" ? "Commercial B2B Partner" : "Residential Customer"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email} • {user?.phone}</p>
              {user?.company_name && (
                <p className="text-xs font-semibold text-aqua-700 mt-1">
                  🏢 {user.company_name} {user.gstin && <span className="text-slate-400 font-normal">({user.gstin})</span>}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="px-4 py-2 bg-navy-950 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition shadow-sm"
            >
              Order Spares
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 hover:text-rose-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
          {[
            { id: "overview", label: "Dashboard Overview" },
            { id: "orders", label: `My Spare Parts Orders (${orders.length})` },
            { id: "inspections", label: `Site Inspections (${inspections.length})` },
            { id: "profile", label: "Account Details" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-aqua-600 text-aqua-700 bg-white/50 rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-navy-950 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Orders</span>
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </span>
                </div>
                <p className="text-3xl font-black text-navy-950">{orders.length}</p>
                <p className="text-xs text-slate-600 mt-1">Components and spare shipments on record.</p>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="mt-4 inline-block text-xs font-semibold text-aqua-600 hover:text-aqua-700"
                >
                  View Order Register &rarr;
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Site Inspections</span>
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <p className="text-3xl font-black text-navy-950">{inspections.length}</p>
                <p className="text-xs text-slate-600 mt-1">Engineer field surveys and water tests.</p>
                <button
                  onClick={() => setActiveTab("inspections")}
                  className="mt-4 inline-block text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View Inspection Status &rarr;
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Verticals</span>
                  <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
                <p className="text-xl font-black text-navy-950">RO + Solar</p>
                <p className="text-xs text-slate-600 mt-1">Full-service commercial water & residential solar coverage.</p>
                <Link
                  href="/track-order"
                  className="mt-4 inline-block text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  Public Tracking Portal &rarr;
                </Link>
              </div>
            </div>

            {/* Quick Actions Band */}
            <div className="bg-navy-950 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-bold">Need Emergency Membrane CIP or Solar Repair?</h3>
                <p className="text-xs text-slate-300">
                  Our regional mobile engineering vans in Visakhapatnam, Vijayawada, and Hyderabad respond within 4 hours.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:18008902847"
                  className="px-4 py-2.5 bg-aqua-600 text-white rounded-xl text-xs font-bold hover:bg-aqua-500 transition shadow-sm"
                >
                  Call 24/7 Hotline: 1800-890-2847
                </a>
                <Link
                  href="/commercial-ro#book-inspection"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20"
                >
                  Book Field Visit
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {loadingRecords ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                Syncing order ledger from Python backend...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy-950">No Orders Yet</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Browse our catalog of commercial RO membranes, multistage pumps, and bifacial solar modules.
                </p>
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition"
                  >
                    Go to Store Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-slate-300 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-navy-950">{ord.order_number}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                              ord.order_status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.order_status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.order_status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Placed on {new Date(ord.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {ord.payment_method} ({ord.payment_status})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(ord)}
                          className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-sky-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>
                        <Link
                          href={`/track-order?ref=${ord.order_number}&phone=${ord.customer_phone}`}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                        >
                          Track Shipment &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {ord.items && ord.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs py-1">
                          <span className="text-navy-950 font-medium">
                            <span className="font-bold text-aqua-700">{item.quantity}x</span> {item.product_name}
                          </span>
                          <span className="font-mono text-slate-700">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Courier and Shipping */}
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-800">Dispatch Details:</span>{" "}
                        {ord.courier_name || "Delhivery Surface"} (AWB: <span className="font-mono font-bold text-navy-950">{ord.tracking_number || "Awaiting Pickup"}</span>)
                      </div>
                      <div className="font-bold text-navy-950">
                        Total Amount: <span className="text-sm font-black text-navy-950">{formatINR(ord.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inspections */}
        {activeTab === "inspections" && (
          <div className="space-y-4">
            {loadingRecords ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                Syncing inspection roster from Python backend...
              </div>
            ) : inspections.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy-950">No Site Inspections Booked</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Schedule an on-site engineer visit for raw water lab tests or rooftop solar shadow analysis.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/commercial-ro#book-inspection"
                    className="px-4 py-2 bg-aqua-600 text-white rounded-xl text-xs font-semibold hover:bg-aqua-700 transition"
                  >
                    Schedule RO Survey
                  </Link>
                  <Link
                    href="/residential-solar#book-inspection"
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition"
                  >
                    Schedule Solar Survey
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {inspections.map((insp) => (
                  <div key={insp.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-slate-300 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-navy-950">{insp.booking_reference}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                              insp.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : insp.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {insp.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            • {insp.vertical === "COMMERCIAL_RO" ? "Commercial RO Water Treatment" : "Residential Rooftop Solar"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          📅 Scheduled: <span className="font-bold text-navy-950">{insp.preferred_date}</span> ({insp.preferred_time_slot})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/track-order?ref=${insp.booking_reference}&phone=${insp.customer_phone}`}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                        >
                          Track Engineer &rarr;
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <p className="font-bold text-navy-950 mb-1">Site Location:</p>
                        <p>{insp.address} - {insp.pincode}</p>
                        {insp.notes && <p className="mt-2 text-slate-500 italic">"{insp.notes}"</p>}
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <p className="font-bold text-navy-950 mb-1">Assigned Field Engineer:</p>
                        <p className="font-semibold text-aqua-700">{insp.assigned_technician || "Assigning lead engineer..."}</p>
                        {insp.technician_phone && (
                          <p className="text-slate-500 mt-1">Direct Contact: <a href={`tel:${insp.technician_phone}`} className="font-bold text-navy-950 hover:underline">{insp.technician_phone}</a></p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl shadow-sm">
            <h2 className="text-lg font-bold text-navy-950 mb-4">Edit Profile & Company Information</h2>
            {updateMessage && (
              <div className="mb-4 p-3 bg-aqua-50 border border-aqua-200 text-aqua-900 rounded-xl text-xs font-semibold">
                {updateMessage}
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email (Cannot be changed)</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-100 text-slate-500 rounded-lg cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization (B2B)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Pure Agro Industries"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="37AAAAA0000A1Z5"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shipping / Installation Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-950"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition disabled:opacity-50"
                >
                  {updating ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
