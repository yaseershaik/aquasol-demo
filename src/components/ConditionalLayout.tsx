"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute = pathname?.startsWith("/auth");

  // On sign in, sign up, forgot password, and admin pages: hide public header & footer completely
  if (isAdminRoute || isAuthRoute) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  // Public customer storefront layout with customer navbar and footer
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
