import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Convert totalAmount to paise (integer)
    const amountInPaise = Math.round(order.totalAmount * 100);

    // If real Razorpay keys are configured in environment
    if (keyId && keySecret && !keyId.startsWith("rzp_test_placeholder")) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: order.orderNumber,
          notes: {
            orderId: order.id,
            customerName: order.customerName,
          },
        }),
      });

      if (!rzpResponse.ok) {
        const errData = await rzpResponse.json();
        throw new Error(errData?.error?.description || "Razorpay API error");
      }

      const rzpData = await rzpResponse.json();

      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: rzpData.id },
      });

      return NextResponse.json({
        success: true,
        isTestMode: false,
        keyId,
        razorpayOrderId: rzpData.id,
        amount: amountInPaise,
        currency: "INR",
        orderNumber: order.orderNumber,
      });
    }

    // Otherwise, simulate a test gateway order for development/demo
    const simulatedOrderId = `order_test_${Date.now().toString(36)}`;
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: simulatedOrderId },
    });

    return NextResponse.json({
      success: true,
      isTestMode: true,
      keyId: "rzp_test_demo_key",
      razorpayOrderId: simulatedOrderId,
      amount: amountInPaise,
      currency: "INR",
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    console.error("POST /api/orders/razorpay/create error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
