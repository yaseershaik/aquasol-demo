import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      config = await prisma.siteConfig.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("GET SiteConfig error:", error);
    return NextResponse.json({ error: "Failed to fetch site config." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const data = await req.json();

    const updated = await prisma.siteConfig.upsert({
      where: { id: "default" },
      update: {
        businessName: data.businessName,
        tagline: data.tagline,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        address: data.address,
        serviceCities: data.serviceCities,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroBannerUrl: data.heroBannerUrl,
        roBannerUrl: data.roBannerUrl,
        solarBannerUrl: data.solarBannerUrl,
        codEnabled: Boolean(data.codEnabled),
        onlinePayEnabled: Boolean(data.onlinePayEnabled),
        shippingFlatFee: Number(data.shippingFlatFee) || 0,
        freeShippingAbove: Number(data.freeShippingAbove) || 0,
      },
      create: {
        id: "default",
        ...data,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT SiteConfig error:", error);
    return NextResponse.json({ error: "Failed to update site config." }, { status: 500 });
  }
}
