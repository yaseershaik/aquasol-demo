import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referenceNumber, phone } = body;

    if (!referenceNumber || !phone) {
      return NextResponse.json(
        { success: false, error: "Please enter your reference number and registered phone number." },
        { status: 400 }
      );
    }

    const cleanRef = referenceNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, ""); // digits only

    // Query Python FastAPI backend first
    try {
      if (cleanRef.startsWith("AQS") || cleanRef.startsWith("ORD")) {
        const pyRes = await fetch(`http://127.0.0.1:8000/api/py/orders/track?ref=${encodeURIComponent(cleanRef)}&phone=${encodeURIComponent(cleanPhone)}`);
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          if (pyData.success && pyData.order) {
            return NextResponse.json({
              success: true,
              type: "ORDER",
              data: pyData.order,
            });
          }
        }
      } else if (cleanRef.startsWith("INS")) {
        const pyRes = await fetch(`http://127.0.0.1:8000/api/py/bookings/track?ref=${encodeURIComponent(cleanRef)}&phone=${encodeURIComponent(cleanPhone)}`);
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          if (pyData.success && pyData.inspection) {
            return NextResponse.json({
              success: true,
              type: "INSPECTION",
              data: pyData.inspection,
            });
          }
        }
      }
    } catch {
      // Continue to local prisma fallback
    }

    // If it's an Order (starts with ORD or generic search)
    if (cleanRef.startsWith("ORD") || cleanRef.includes("-")) {
      const orders = await prisma.order.findMany({
        where: {
          orderNumber: cleanRef,
        },
        include: {
          items: true,
        },
      });

      const matchedOrder = orders.find((o) => {
        const orderPhoneDigits = o.customerPhone.replace(/\D/g, "");
        return (
          orderPhoneDigits === cleanPhone ||
          orderPhoneDigits.endsWith(cleanPhone) ||
          cleanPhone.endsWith(orderPhoneDigits)
        );
      });

      if (matchedOrder) {
        return NextResponse.json({
          success: true,
          type: "ORDER",
          data: matchedOrder,
        });
      }
    }

    // If it's an Inspection Booking (starts with INS or generic search)
    if (cleanRef.startsWith("INS") || cleanRef.includes("-")) {
      const bookings = await prisma.inspectionBooking.findMany({
        where: {
          bookingNumber: cleanRef,
        },
      });

      const matchedBooking = bookings.find((b) => {
        const bookingPhoneDigits = b.customerPhone.replace(/\D/g, "");
        return (
          bookingPhoneDigits === cleanPhone ||
          bookingPhoneDigits.endsWith(cleanPhone) ||
          cleanPhone.endsWith(bookingPhoneDigits)
        );
      });

      if (matchedBooking) {
        return NextResponse.json({
          success: true,
          type: "INSPECTION",
          data: matchedBooking,
        });
      }
    }

    // Try finding by order first, then booking without prefix restrictions
    const anyOrder = await prisma.order.findFirst({
      where: {
        orderNumber: { contains: cleanRef },
      },
      include: { items: true },
    });

    if (anyOrder) {
      const orderPhoneDigits = anyOrder.customerPhone.replace(/\D/g, "");
      if (
        orderPhoneDigits === cleanPhone ||
        orderPhoneDigits.endsWith(cleanPhone) ||
        cleanPhone.endsWith(orderPhoneDigits)
      ) {
        return NextResponse.json({
          success: true,
          type: "ORDER",
          data: anyOrder,
        });
      }
    }

    const anyBooking = await prisma.inspectionBooking.findFirst({
      where: {
        bookingNumber: { contains: cleanRef },
      },
    });

    if (anyBooking) {
      const bookingPhoneDigits = anyBooking.customerPhone.replace(/\D/g, "");
      if (
        bookingPhoneDigits === cleanPhone ||
        bookingPhoneDigits.endsWith(cleanPhone) ||
        cleanPhone.endsWith(bookingPhoneDigits)
      ) {
        return NextResponse.json({
          success: true,
          type: "INSPECTION",
          data: anyBooking,
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "No order or booking found matching those details. Please check the reference number and phone number." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("POST /api/orders/track error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track reference" },
      { status: 500 }
    );
  }
}
