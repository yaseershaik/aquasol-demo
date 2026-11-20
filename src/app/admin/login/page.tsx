"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, ExternalLink, Globe, Droplets, Sun, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@puregridsystems.in");
  const [password, setPassword] = useState("Admin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Edge case validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your administrator email address.");
      return;
    }
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setErrorMsg("Please enter a valid email address (e.g. admin@puregridsystems.in).");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your security password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid administrator credentials. Please verify your email and password.");
      }

      if (data.access_token) {
        document.cookie = `aquasol_user_token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
      }

      window.location.href = "/admin";
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || !navigator.onLine) {
        setErrorMsg("Network error: Unable to reach the server. Please check your internet connection.");
      } else {
        setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setEmail("admin@puregridsystems.in");
    setPassword("Admin@12345");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#0284C7] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Customer Branding Logo */}
        <img
          src="/logo-mark.svg"
          alt="AQUASOL Logo"
          className="w-14 h-14 rounded-2xl mx-auto shadow-md"
        />
        <div className="mt-4 flex items-center justify-center leading-none">
          <span className="text-3xl font-black text-[#0284C7] tracking-tight">AQUA</span>
          <span className="text-3xl font-black text-[#D97706] tracking-tight">SOL</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#0284C7] font-bold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PureGrid Operations Console</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Authorized enterprise personnel sign-in for pan-India catalog, logistics dispatch, and site CMS.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl py-8 px-6 sm:px-10 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@puregridsystems.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-10 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Fill Default Credentials</span>
              </button>
              <Link
                href="/auth/forgot-password"
                className="text-slate-500 hover:text-[#0284C7] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating Session..." : "Sign In to Operations Console"}
            </button>
          </form>

          {/* Quick Return to Storefront */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/"
              className="hover:text-slate-900 flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Storefront</span>
            </Link>

            <span className="text-[10px] text-slate-400 font-mono">v1.0.0 Production</span>
          </div>
        </div>
      </div>
    </div>
  );
}
