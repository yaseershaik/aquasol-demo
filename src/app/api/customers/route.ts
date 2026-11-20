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
    const query = searchParams.get("q")?.toLowerCase().trim() || "";

    // 1. Fetch from Python FastAPI backend
    let pyUsers: any[] = [];
    try {
      const pyRes = await fetch("http://127.0.0.1:8000/api/py/auth/users/admin", {
        cache: "no-store",
      });
      if (pyRes.ok) {
        const pyData = await pyRes.json();
        if (pyData.success && Array.isArray(pyData.users)) {
          pyUsers = pyData.users;
        }
      }
    } catch (e) {
      console.warn("Could not fetch Python users", e);
    }

    // 2. Fetch all orders from Prisma to calculate customer spend & metrics
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        customerEmail: true,
        city: true,
        state: true,
        pincode: true,
        totalAmount: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    // 3. Aggregate customer records
    const customerMap = new Map<string, any>();

    // Seed with registered Python users
    for (const u of pyUsers) {
      const key = (u.email || u.phone).toLowerCase().trim();
      customerMap.set(key, {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        companyName: u.company_name || null,
        gstin: u.gstin || null,
        city: u.city || "Visakhapatnam",
        state: u.state || "Andhra Pradesh",
        role: u.role || "customer",
        isRegistered: true,
        isActive: u.is_active ?? true,
        totalOrders: 0,
        totalSpent: 0,
        recentOrders: [],
        createdAt: u.created_at || new Date().toISOString(),
      });
    }

    // Overlay order statistics
    for (const ord of orders) {
      const key = (ord.customerEmail || ord.customerPhone).toLowerCase().trim();
      let record = customerMap.get(key);

      if (!record) {
        // Find by phone
        for (const [_, existing] of customerMap.entries()) {
          if (existing.phone && ord.customerPhone && existing.phone.replace(/\D/g, "").slice(-10) === ord.customerPhone.replace(/\D/g, "").slice(-10)) {
            record = existing;
            break;
          }
        }
      }

      if (!record) {
        record = {
          id: `ord-cust-${ord.id.slice(0, 8)}`,
          name: ord.customerName,
          email: ord.customerEmail || "",
          phone: ord.customerPhone,
          companyName: null,
          gstin: null,
          city: ord.city,
          state: ord.state,
          role: "customer",
          isRegistered: false,
          isActive: true,
          totalOrders: 0,
          totalSpent: 0,
          recentOrders: [],
          createdAt: ord.createdAt.toISOString(),
        };
        customerMap.set(key, record);
      }

      record.totalOrders += 1;
      record.totalSpent += ord.totalAmount;
      if (record.recentOrders.length < 3) {
        record.recentOrders.push({
          orderNumber: ord.orderNumber,
          totalAmount: ord.totalAmount,
          orderStatus: ord.orderStatus,
          paymentStatus: ord.paymentStatus,
          createdAt: ord.createdAt.toISOString(),
        });
      }
    }

    let customersList = Array.from(customerMap.values());

    // Search filter
    if (query) {
      customersList = customersList.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.companyName && c.companyName.toLowerCase().includes(query)) ||
          c.city.toLowerCase().includes(query)
      );
    }

    // Sort by totalSpent desc, then totalOrders desc
    customersList.sort((a, b) => b.totalSpent - a.totalSpent || b.totalOrders - a.totalOrders);

    return NextResponse.json({
      success: true,
      totalCount: customersList.length,
      customers: customersList,
    });
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer directory" },
      { status: 500 }
    );
  }
}
