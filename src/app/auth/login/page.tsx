"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/user-auth";
import { Droplets, Sun, ShieldCheck, Mail, Lock, Eye, EyeOff, KeyRound, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      // Route based on authenticated role
      if (res.role === "admin" || res.redirectUrl === "/admin") {
        window.location.href = "/admin";
      } else {
        router.push(redirect || "/account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail("customer@example.com");
    setPassword("password123");
    setError(null);
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@puregridsystems.in");
    setPassword("Admin@12345");
    setError(null);
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      {/* Brand Header */}
      <div className="text-center">
        <Link href="/" className="inline-flex flex-col items-center group select-none mb-2">
          <img
            src="/logo-mark.svg"
            alt="AQUASOL Logo"
            className="w-12 h-12 rounded-xl shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center leading-none mt-2">
            <span className="text-2xl font-black text-[#0284C7] tracking-tight">AQUA</span>
            <span className="text-2xl font-black text-[#D97706] tracking-tight">SOL</span>
          </div>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Unified Account Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in using your customer email or administrative credentials.
        </p>
      </div>

      {/* Demo Credentials Fast-Fill Toolbar */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-700">Customer Demo:</span>
            <span className="text-slate-500 ml-1.5 font-mono text-[11px]">customer@example.com</span>
            <span className="text-slate-400 text-[10px] ml-1">(password123)</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCustomer}
            className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-[#0284C7] rounded-lg font-bold text-[11px] transition"
          >
            Auto-Fill
          </button>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
          <div>
            <span className="font-bold text-slate-700">Admin Demo:</span>
            <span className="text-slate-500 ml-1.5 font-mono text-[11px]">admin@puregridsystems.in</span>
            <span className="text-slate-400 text-[10px] ml-1">(Admin@12345)</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold text-[11px] transition"
          >
            Auto-Fill
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white transition"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#0284C7] hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] focus:bg-white transition"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Authenticating Account...</span>
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
        <p className="text-slate-600">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/signup" className="text-[#0284C7] font-bold hover:underline">
            Register Account
          </Link>
        </p>
        <div className="text-slate-500">
          <Link href="/auth/forgot-password" className="text-slate-600 hover:underline">
            Forgot your password? Reset it here &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading sign in portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
