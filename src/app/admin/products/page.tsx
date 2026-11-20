"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Droplets,
  Sun,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  vertical: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  vertical: string;
  shortSummary: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  gstPercent: number;
  stockQuantity: number;
  isFeatured: boolean;
  isPublished: boolean;
  images: string;
  specifications: string;
  categoryId: string;
  category?: Category;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verticalFilter, setVerticalFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formVertical, setFormVertical] = useState("RO");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formComparePrice, setFormComparePrice] = useState("");
  const [formGst, setFormGst] = useState("18");
  const [formStock, setFormStock] = useState("10");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [specList, setSpecList] = useState<{ key: string; value: string }[]>([
    { key: "Capacity", value: "" },
    { key: "Warranty", value: "1 Year Standard" },
  ]);

  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/products?all=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to retrieve catalog`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || "Failed to load catalog inventory. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormName("");
    setFormSlug("");
    setFormSku("");
    setFormVertical("RO");
    setFormCategoryId(categories[0]?.id || "");
    setFormSummary("");
    setFormDescription("");
    setFormPrice("");
    setFormComparePrice("");
    setFormGst("18");
    setFormStock("15");
    setFormImageUrl("");
    setFormIsFeatured(false);
    setFormIsPublished(true);
    setSpecList([
      { key: "Origin / Brand", value: "AQUASOL PureGrid" },
      { key: "Warranty", value: "1 Year Replacement Warranty" },
    ]);
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormSku(p.sku);
    setFormVertical(p.vertical);
    setFormCategoryId(p.categoryId);
    setFormSummary(p.shortSummary);
    setFormDescription(p.description);
    setFormPrice(p.price.toString());
    setFormComparePrice(p.compareAtPrice ? p.compareAtPrice.toString() : "");
    setFormGst(p.gstPercent.toString());
    setFormStock(p.stockQuantity.toString());
    setFormIsFeatured(p.isFeatured);
    setFormIsPublished(p.isPublished);

    try {
      const imgs = JSON.parse(p.images);
      setFormImageUrl(Array.isArray(imgs) && imgs[0] ? imgs[0] : "");
    } catch {
      setFormImageUrl(typeof p.images === "string" ? p.images : "");
    }

    try {
      const specs = JSON.parse(p.specifications);
      if (Array.isArray(specs) && specs.length > 0) {
        setSpecList(specs);
      } else {
        setSpecList([{ key: "Warranty", value: "1 Year" }]);
      }
    } catch {
      setSpecList([{ key: "Warranty", value: "1 Year" }]);
    }
  };

  const handleQuickStockUpdate = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stockQuantity + delta);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, stockQuantity: newStock } : p))
        );
      }
    } catch (err) {
      console.error("Stock update error", err);
    }
  };

  const handleTogglePublish = async (product: Product) => {
    const nextVal = !product.isPublished;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextVal }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isPublished: nextVal } : p))
        );
        setFeedbackMsg({
          type: "success",
          text: `Product is now ${nextVal ? "LIVE on customer storefront" : "HIDDEN (Draft)"}.`,
        });
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: formSku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      vertical: formVertical,
      categoryId: formCategoryId || categories[0]?.id,
      shortSummary: formSummary,
      description: formDescription,
      price: parseFloat(formPrice) || 0,
      compareAtPrice: formComparePrice ? parseFloat(formComparePrice) : null,
      gstPercent: parseFloat(formGst) || 18,
      stockQuantity: parseInt(formStock, 10) || 0,
      isFeatured: formIsFeatured,
      isPublished: formIsPublished,
      images: formImageUrl ? [formImageUrl] : ["/images/products/placeholder.jpg"],
      specifications: specList.filter((s) => s.key.trim() && s.value.trim()),
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update product");
        setFeedbackMsg({ type: "success", text: "Product successfully updated!" });
        setEditingProduct(null);
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create product");
        setFeedbackMsg({ type: "success", text: "New product published successfully!" });
        setIsAddModalOpen(false);
      }
      fetchProducts();
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to save product." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteCandidate) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/${deleteCandidate.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Could not delete product");
      setFeedbackMsg({ type: "success", text: `Deleted "${deleteCandidate.name}"` });
      setProducts((prev) => prev.filter((p) => p.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Deletion failed" });
    } finally {
      setActionLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (verticalFilter !== "ALL" && p.vertical !== verticalFilter) return false;
    if (stockFilter === "IN_STOCK" && p.stockQuantity <= 0) return false;
    if (stockFilter === "OUT_OF_STOCK" && p.stockQuantity > 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Inventory & Catalog Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Products & Live Stock Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, edit, adjust live inventory counts, or toggle items on the customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Customer Catalog</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-xs animate-in fade-in ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-semibold">{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, or keyword..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Vertical Filter */}
          <select
            value={verticalFilter}
            onChange={(e) => setVerticalFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0284C7]"
          >
            <option value="ALL">All Verticals</option>
            <option value="RO">Commercial RO</option>
            <option value="SOLAR">Residential Solar</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0284C7]"
          >
            <option value="ALL">All Stock Levels</option>
            <option value="IN_STOCK">In Stock (&gt;0)</option>
            <option value="OUT_OF_STOCK">Zero Stock / Restock Needed</option>
          </select>

          <span className="text-xs text-slate-500 pl-2">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {products.length} SKUs
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Product & SKU</th>
                <th className="py-3 px-3 font-semibold">Vertical & Category</th>
                <th className="py-3 px-3 font-semibold">Unit Price (GST)</th>
                <th className="py-3 px-3 font-semibold">Live Stock</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-in fade-in">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg shimmer-mask shrink-0"></div>
                        <div className="space-y-1.5 flex-1 max-w-xs">
                          <div className="w-32 sm:w-48 h-4 rounded shimmer-mask"></div>
                          <div className="w-20 h-3 rounded shimmer-mask"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-24 h-5 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-20 h-4 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-16 h-6 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="w-24 h-6 rounded shimmer-mask"></div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="w-16 h-6 rounded shimmer-mask ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : fetchError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-slate-600">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <span className="font-bold text-sm text-slate-800">Connection Interrupted</span>
                      <span className="text-xs text-slate-500">{fetchError}</span>
                      <button
                        onClick={fetchProducts}
                        className="mt-2 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        Retry Loading
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  let imgUrl = "/images/products/placeholder.jpg";
                  try {
                    const parsed = JSON.parse(p.images);
                    if (Array.isArray(parsed) && parsed[0]) imgUrl = parsed[0];
                  } catch {
                    if (typeof p.images === "string" && p.images.startsWith("http")) imgUrl = p.images;
                  }

                  const isRo = p.vertical === "RO";

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                              {p.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {p.sku}
                              </span>
                              {p.isFeatured && (
                                <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Vertical & Category */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isRo
                                ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {isRo ? "Commercial RO" : "Solar Power"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium">
                          {p.category?.name || "General Spares"}
                        </div>
                      </td>

                      {/* Price & GST */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {formatINR(p.price)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          +{p.gstPercent}% GST included
                        </div>
                      </td>

                      {/* Live Stock Counter with Quick Adjust */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuickStockUpdate(p, -1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 transition-colors"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold text-xs min-w-[28px] text-center ${
                              p.stockQuantity <= 0
                                ? "text-rose-700 font-extrabold"
                                : p.stockQuantity < 5
                                ? "text-amber-700"
                                : "text-emerald-700"
                            }`}
                          >
                            {p.stockQuantity}
                          </span>
                          <button
                            onClick={() => handleQuickStockUpdate(p, 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 transition-colors"
                            title="Increase Stock"
                          >
                            +
                          </button>
                        </div>
                        {p.stockQuantity <= 0 ? (
                          <span className="text-[10px] text-rose-700 font-bold block mt-0.5">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Units ready
                          </span>
                        )}
                      </td>

                      {/* Status & Storefront Toggle */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                            p.isPublished
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800"
                          }`}
                          title="Click to toggle published status on live customer site"
                        >
                          {p.isPublished ? "Live on Storefront" : "Draft (Hidden)"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 rounded-md transition-colors"
                            title="View on Customer Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(p)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  {editingProduct ? "Catalog Editor" : "New SKU Creation"}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Add New Component / Skid"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. 500 LPH Turnkey RO Plant"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SKU Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. PG-RO-500"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vertical *
                  </label>
                  <select
                    value={formVertical}
                    onChange={(e) => setFormVertical(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="RO">Commercial RO</option>
                    <option value="SOLAR">Residential Solar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.vertical})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="9999"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Compare at MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formComparePrice}
                    onChange={(e) => setFormComparePrice(e.target.value)}
                    placeholder="12999"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GST Rate (%) *
                  </label>
                  <select
                    value={formGst}
                    onChange={(e) => setFormGst(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                  >
                    <option value="18">18% Standard GST</option>
                    <option value="12">12% Solar / Water Components</option>
                    <option value="5">5% Renewable Equipment</option>
                    <option value="28">28% High-Grade Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://... or /images/products/..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Summary (Storefront Card Copy) *
                </label>
                <input
                  type="text"
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="High-performance FRP membrane housing rated for 300 PSI."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Engineering Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive technical details, operating pressures, materials of construction, and installation instructions."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {/* Dynamic Specifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Technical Specifications
                  </label>
                  <button
                    type="button"
                    onClick={() => setSpecList([...specList, { key: "", value: "" }])}
                    className="text-[11px] text-[#0284C7] hover:underline font-bold"
                  >
                    + Add Parameter
                  </button>
                </div>
                <div className="space-y-2">
                  {specList.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Spec Name (e.g. Flow Rate)"
                        value={spec.key}
                        onChange={(e) => {
                          const updated = [...specList];
                          updated[i].key = e.target.value;
                          setSpecList(updated);
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 500 LPH)"
                        value={spec.value}
                        onChange={(e) => {
                          const updated = [...specList];
                          updated[i].value = e.target.value;
                          setSpecList(updated);
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                      />
                      {specList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSpecList(specList.filter((_, idx) => idx !== i))}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-[#0284C7] focus:ring-0"
                  />
                  <span>Feature on Storefront Homepage</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="rounded border-slate-300 text-[#0284C7] focus:ring-0"
                  />
                  <span>Publish Immediately (Make Visible to Customers)</span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 text-center"
                >
                  {actionLoading ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Delete Catalog Product?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">&quot;{deleteCandidate.name}&quot;</strong> ({deleteCandidate.sku})? This will permanently remove it from the customer storefront and database.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
