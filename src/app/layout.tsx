import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";

export const metadata: Metadata = {
  title: "AQUASOL Systems | Commercial RO Water Plants & Residential Rooftop Solar",
  description:
    "AQUASOL engineers high-performance commercial reverse osmosis plants (250-50,000 LPH), provides authentic RO spare parts with live inventory, and installs rooftop solar with PM Surya Ghar subsidy support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A]"
      >
        <SiteConfigProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <NetworkStatusIndicator />
        </SiteConfigProvider>
      </body>
    </html>
  );
}
