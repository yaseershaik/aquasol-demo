"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SiteConfigData {
  id: string;
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  serviceCities: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;
  roBannerUrl: string;
  solarBannerUrl: string;
  codEnabled: boolean;
  onlinePayEnabled: boolean;
  shippingFlatFee: number;
  freeShippingAbove: number;
  updatedAt?: string;
}

const defaultConfig: SiteConfigData = {
  id: "default",
  businessName: "AQUASOL PureGrid",
  tagline: "Commercial RO Water Plants, Spare Parts & Rooftop Solar Installations",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "contact@puregridsystems.in",
  address: "Plot 42, APIIC Industrial Park, Visakhapatnam, Andhra Pradesh 530012",
  serviceCities: "Visakhapatnam, Vijayawada, Guntur, Tirupati & Pan-India Spares Delivery",
  heroTitle: "Engineered Clean Water & Solar Energy for Homes and Enterprise",
  heroSubtitle: "Order genuine RO spare parts with live inventory across India, schedule on-site water quality audits, or deploy subsidized rooftop solar.",
  heroBannerUrl: "",
  roBannerUrl: "",
  solarBannerUrl: "",
  codEnabled: true,
  onlinePayEnabled: true,
  shippingFlatFee: 99,
  freeShippingAbove: 2500,
};

interface SiteConfigContextType {
  config: SiteConfigData;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  loading: false,
  refresh: async () => {},
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfigData>(defaultConfig);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/site-config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setConfig({
            ...defaultConfig,
            ...data,
            shippingFlatFee: Number(data.shippingFlatFee) || 0,
            freeShippingAbove: Number(data.freeShippingAbove) || 0,
          });
        }
      }
    } catch (e) {
      console.warn("Could not load dynamic site config, using defaults:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();

    // Listen for instant updates dispatched from Admin Settings CMS
    const handleConfigUpdated = () => {
      fetchConfig();
    };

    window.addEventListener("site-config-updated", handleConfigUpdated);
    window.addEventListener("storage", handleConfigUpdated);

    return () => {
      window.removeEventListener("site-config-updated", handleConfigUpdated);
      window.removeEventListener("storage", handleConfigUpdated);
    };
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading, refresh: fetchConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
