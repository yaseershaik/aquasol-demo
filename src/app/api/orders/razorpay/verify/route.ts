import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real keys are present and not test simulation
    if (keySecret && razorpaySignature && razorpayOrderId && !razorpayOrderId.startsWith("order_test_")) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 }
        );
      }
    }

    // Payment verified or test simulated payment
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        razorpayPaymentId: razorpayPaymentId || `pay_test_${Date.now().toString(36)}`,
        razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified",
      order: updated,
    });
  } catch (error: any) {
    console.error("POST /api/orders/razorpay/verify error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
