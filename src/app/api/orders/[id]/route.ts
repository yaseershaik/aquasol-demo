import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus, courierName, trackingNumber } = body;

    // Also sync update to Python backend
    try {
      await fetch(`http://127.0.0.1:8000/api/py/orders/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_status: orderStatus,
          payment_status: paymentStatus,
          courier_name: courierName,
          tracking_number: trackingNumber,
        }),
      });
    } catch {}

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      // Check if it was updated in Python backend
      try {
        const pyRes = await fetch(`http://127.0.0.1:8000/api/py/orders/${encodeURIComponent(id)}`);
        if (pyRes.ok) {
          const pyOrder = await pyRes.json();
          return NextResponse.json({
            success: true,
            order: {
              id: pyOrder.id,
              orderNumber: pyOrder.order_number,
              customerName: pyOrder.customer_name,
              customerPhone: pyOrder.customer_phone,
              shippingAddress: pyOrder.shipping_address,
              paymentMethod: pyOrder.payment_method,
              paymentStatus: pyOrder.payment_status,
              orderStatus: pyOrder.order_status,
              courierName: pyOrder.courier_name,
              trackingNumber: pyOrder.tracking_number,
              totalAmount: pyOrder.total_amount,
              createdAt: pyOrder.created_at,
              items: pyOrder.items || [],
            },
          });
        }
      } catch {}
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: orderStatus !== undefined ? orderStatus : existing.orderStatus,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : existing.paymentStatus,
        courierName: courierName !== undefined ? (courierName ? courierName.trim() : null) : existing.courierName,
        trackingNumber: trackingNumber !== undefined ? (trackingNumber ? trackingNumber.trim() : null) : existing.trackingNumber,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
