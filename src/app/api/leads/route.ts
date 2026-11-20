import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (serviceType && serviceType !== "ALL") {
      where.serviceType = serviceType;
    }

    const leads = await prisma.leadQuote.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lead quotes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serviceType = body.serviceType || body.vertical;
    const customerName = body.customerName || body.customer_name;
    const customerPhone = body.customerPhone || body.customer_phone;
    const customerEmail = body.customerEmail || body.customer_email;
    const city = body.city;
    const technicalDetails = body.technicalDetails || body.technical_details;

    if (!serviceType || !customerName || !customerPhone || !city) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, phone number, and city." },
        { status: 400 }
      );
    }

    const leadNumber = `LD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const detailsString =
      typeof technicalDetails === "object"
        ? JSON.stringify(technicalDetails)
        : technicalDetails || "{}";

    const lead = await prisma.leadQuote.create({
      data: {
        leadNumber,
        serviceType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        city: city.trim(),
        technicalDetails: detailsString,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      lead,
      lead_reference: lead.leadNumber,
      customer_name: lead.customerName,
      customer_phone: lead.customerPhone,
      vertical: lead.serviceType,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
