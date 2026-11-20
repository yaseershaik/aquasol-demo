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
    const paymentStatus = searchParams.get("paymentStatus");

    const where: any = {};
    if (status && status !== "ALL") {
      where.orderStatus = status;
    }
    if (paymentStatus && paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus;
    }

    // 1. Fetch from Python backend
    let pyOrders: any[] = [];
    try {
      const url = new URL("http://127.0.0.1:8000/api/py/orders/admin");
      if (status && status !== "ALL") url.searchParams.set("status", status);
      if (paymentStatus && paymentStatus !== "ALL") url.searchParams.set("payment_status", paymentStatus);
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (res.ok) {
        const raw = await res.json();
        if (Array.isArray(raw)) {
          pyOrders = raw.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            customerEmail: o.customer_email,
            shippingAddress: o.shipping_address,
            city: o.city || "",
            state: o.state || "Andhra Pradesh",
            pincode: o.pincode,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            orderStatus: o.order_status,
            courierName: o.courier_name,
            trackingNumber: o.tracking_number,
            subtotal: o.subtotal,
            gstAmount: o.tax_total,
            shippingFee: o.shipping_fee || 0,
            totalAmount: o.total_amount,
            createdAt: o.created_at,
            items: (o.items || []).map((it: any) => ({
              id: it.id,
              productName: it.product_name,
              sku: it.sku || "GENUINE-PART",
              quantity: it.quantity,
              unitPrice: it.price,
              gstPercent: it.tax_percent,
            })),
          }));
        }
      }
    } catch {}

    // 2. Fetch from Prisma
    const prismaOrders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Merge by unique orderNumber
    const seen = new Set<string>();
    const mergedOrders: any[] = [];
    for (const o of [...pyOrders, ...prismaOrders]) {
      if (!seen.has(o.orderNumber)) {
        seen.add(o.orderNumber);
        mergedOrders.push(o);
      }
    }

    return NextResponse.json({ success: true, orders: mergedOrders });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = body.customerName || body.customer_name;
    const customerPhone = body.customerPhone || body.customer_phone;
    const customerEmail = body.customerEmail || body.customer_email;
    const shippingAddress = body.shippingAddress || body.shipping_address;
    const city = body.city;
    const state = body.state || "Andhra Pradesh";
    const pincode = body.pincode;
    const paymentMethod = body.paymentMethod || body.payment_method || "COD";
    const rawItems = body.items || [];
    const items = rawItems.map((it: any) => ({
      productId: it.productId || it.product_id,
      quantity: Number(it.quantity) || 1,
    }));

    // Validation
    if (!customerName || !customerPhone || !shippingAddress || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required shipping fields." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (paymentMethod !== "COD" && paymentMethod !== "ONLINE") {
      return NextResponse.json(
        { success: false, error: "Invalid payment method. Choose Cash on Delivery or Online Payment." },
        { status: 400 }
      );
    }

    // Fetch site config for shipping calculation and payment settings
    const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
    const shippingFlatFee = config?.shippingFlatFee ?? 99;
    const freeShippingAbove = config?.freeShippingAbove ?? 2500;

    if (paymentMethod === "COD" && config && !config.codEnabled) {
      return NextResponse.json(
        { success: false, error: "Cash on delivery is currently disabled." },
        { status: 400 }
      );
    }

    if (paymentMethod === "ONLINE" && config && !config.onlinePayEnabled) {
      return NextResponse.json(
        { success: false, error: "Online payments are currently disabled." },
        { status: 400 }
      );
    }

    // Execute atomic transaction: Re-query live stock, verify and decrement, create order
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      let totalGst = 0;
      const orderItemsData: Array<{
        productId: string;
        productName: string;
        sku: string;
        quantity: number;
        unitPrice: number;
        gstPercent: number;
      }> = [];

      for (const item of items) {
        if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new Error("Invalid item in order request.");
        }

        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found.`);
        }

        if (!product.isPublished) {
          throw new Error(`Product "${product.name}" is no longer available.`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Only ${product.stockQuantity} unit(s) available.`
          );
        }

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        const lineSubtotal = product.price * item.quantity;
        const lineGst = lineSubtotal * (product.gstPercent / 100);
        subtotal += lineSubtotal;
        totalGst += lineGst;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: item.quantity,
          unitPrice: product.price,
          gstPercent: product.gstPercent,
        });
      }

      // Calculate final shipping fee
      const calculatedShippingFee = subtotal >= freeShippingAbove ? 0 : shippingFlatFee;
      const totalAmount = Math.round((subtotal + totalGst + calculatedShippingFee) * 100) / 100;

      // Generate unique order number
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          shippingAddress: shippingAddress.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
          orderStatus: "PLACED",
          subtotal: Math.round(subtotal * 100) / 100,
          gstAmount: Math.round(totalGst * 100) / 100,
          shippingFee: calculatedShippingFee,
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: result,
      orderNumber: result.orderNumber,
      order_number: result.orderNumber,
      customerName: result.customerName,
      customer_name: result.customerName,
      customerPhone: result.customerPhone,
      customer_phone: result.customerPhone,
      customerEmail: result.customerEmail,
      customer_email: result.customerEmail,
      shippingAddress: result.shippingAddress,
      shipping_address: result.shippingAddress,
      city: result.city,
      state: result.state,
      pincode: result.pincode,
      paymentMethod: result.paymentMethod,
      payment_method: result.paymentMethod,
      paymentStatus: result.paymentStatus,
      payment_status: result.paymentStatus,
      totalAmount: result.totalAmount,
      total_amount: result.totalAmount,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order" },
      { status: 400 }
    );
  }
}
