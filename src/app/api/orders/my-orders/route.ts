import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aquasol_puregrid_master_secure_production_key_2026"
);

export async function GET(req: Request) {
  try {
    let token: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/aquasol_user_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const email = (payload.email as string).toLowerCase().trim();

    // 1. Fetch from Prisma
    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      order_number: o.orderNumber,
      customer_name: o.customerName,
      customer_phone: o.customerPhone,
      shipping_address: `${o.shippingAddress}, ${o.city}, ${o.state} - ${o.pincode}`,
      pincode: o.pincode,
      subtotal: o.subtotal,
      tax_total: o.gstAmount,
      total_amount: o.totalAmount,
      payment_method: o.paymentMethod,
      payment_status: o.paymentStatus,
      order_status: o.orderStatus,
      courier_name: o.courierName,
      tracking_number: o.trackingNumber,
      created_at: o.createdAt.toISOString(),
      items: o.items.map((it) => ({
        id: it.id,
        product_name: it.productName,
        quantity: it.quantity,
        price: it.unitPrice,
        tax_percent: it.gstPercent,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/orders/my-orders error:", err);
    return NextResponse.json([], { status: 200 }); // Graceful fallback
  }
}
